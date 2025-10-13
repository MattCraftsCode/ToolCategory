import { config } from "dotenv";
import postgres from "postgres";

config();

const { DATABASE_URL, MODEL_PROVIDER, MODEL_API_KEY, MODEL_BASE_URL } =
  process.env;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is required");
  process.exit(1);
}

const provider = (MODEL_PROVIDER ?? "openrouter").toLowerCase();
const supportedProviders = new Set(["openrouter", "siliconflow"]);

if (!supportedProviders.has(provider)) {
  console.warn(
    `⚠️  Unrecognized MODEL_PROVIDER "${provider}". Falling back to OpenRouter-compatible defaults.`
  );
}

const apiKey = MODEL_API_KEY;

if (!apiKey) {
  console.error("❌ MODEL_API_KEY is required");
  process.exit(1);
}

const DEFAULT_MODELS: Record<string, string> = {
  openrouter: "deepseek/deepseek-chat-v3-0324:free",
  siliconflow: "deepseek-ai/DeepSeek-V3.1-Terminus",
};

const fallbackModel = DEFAULT_MODELS[provider] ?? DEFAULT_MODELS.openrouter;

const baseUrl =
  MODEL_BASE_URL && MODEL_BASE_URL.trim().length > 0
    ? MODEL_BASE_URL
    : provider === "siliconflow"
    ? "https://api.siliconflow.cn/v1"
    : "https://openrouter.ai/api/v1";

const DEFAULT_LIMIT = 5;
const USAGE = `Usage: pnpm tsx scripts/enrich-sites.ts [options]

Options:
  --limit <number>     Maximum sites to process (default: ${DEFAULT_LIMIT})
  --no-limit           Process every pending site
  --retry <0-3>        Additional attempts if AI output fails validation (default: 1)
  --dry-run            Show changes without writing to the database
  --model <id>         Override the default model id for the provider
  -h, --help           Display this message

Environment:
  DATABASE_URL         Postgres connection string (required)
  MODEL_PROVIDER       Target provider (openrouter | siliconflow, default: openrouter)
  MODEL_API_KEY        Provider API key (required)
  MODEL_BASE_URL       Optional base URL override for the provider
`;

type CliOptions = {
  limit: number;
  dryRun: boolean;
  retry: number;
  model?: string;
};

type SiteRow = {
  id: number;
  name?: string | null;
  link: string;
  description?: string | null;
  introduce?: string | null;
  introduction?: string | null;
};

type EnrichedContent = {
  name?: string;
  description: string;
  introduce: string;
};

const sql = postgres(DATABASE_URL, { prepare: false });

function parseCliOptions(): CliOptions {
  const options: CliOptions = {
    limit: DEFAULT_LIMIT,
    dryRun: false,
    retry: 1,
  };

  const args = process.argv.slice(2);

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }

    if (arg === "--no-limit") {
      options.limit = Number.POSITIVE_INFINITY;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      const value = Number.parseInt(arg.split("=")[1] ?? "", 10);
      if (Number.isFinite(value) && value > 0) {
        options.limit = value;
      }
      continue;
    }

    if (arg === "--limit" && index + 1 < args.length) {
      const value = Number.parseInt(args[index + 1]!, 10);
      if (Number.isFinite(value) && value > 0) {
        options.limit = value;
      }
      index += 1;
      continue;
    }

    if (arg.startsWith("--retry=")) {
      const value = Number.parseInt(arg.split("=")[1] ?? "", 10);
      if (Number.isFinite(value) && value >= 0 && value <= 3) {
        options.retry = value;
      }
      continue;
    }

    if (arg === "--retry" && index + 1 < args.length) {
      const value = Number.parseInt(args[index + 1]!, 10);
      if (Number.isFinite(value) && value >= 0 && value <= 3) {
        options.retry = value;
      }
      index += 1;
      continue;
    }

    if (arg.startsWith("--model=")) {
      const value = arg.split("=")[1]?.trim();
      if (value) {
        options.model = value;
      }
      continue;
    }

    if (arg === "--model" && index + 1 < args.length) {
      const value = args[index + 1]?.trim();
      if (value) {
        options.model = value;
      }
      index += 1;
    }
  }

  return options;
}

function normalizeUrl(link: string): string | null {
  try {
    return new URL(link).toString();
  } catch (error) {
    try {
      return new URL(`https://${link}`).toString();
    } catch (err) {
      return null;
    }
  }
}

function cleanText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractBetween(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  if (!match) {
    return null;
  }
  return decodeEntities(match[1] ?? "").trim() || null;
}

function extractTitle(html: string): string | null {
  return extractBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
}

function extractMeta(html: string, name: string): string | null {
  const metaPattern = new RegExp(
    `<meta[^>]+(?:name|property)=(?:"|')${name}(?:"|')[^>]*content=(?:"|')([^"']+)(?:"|')[^>]*>`,
    "i"
  );
  return extractBetween(html, metaPattern);
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, length: number): string {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length - 3)}...`;
}

function countWords(value: string): number {
  return value
    .replace(/[\n\r]+/g, " ")
    .replace(/[#*_`>\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ToolCategoryBot/1.0 (+https://toolcategory.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(
        `⚠️  Failed to fetch ${url}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      console.warn(`⚠️  Skipping ${url}: content-type ${contentType}`);
      return null;
    }

    const html = await response.text();
    return html;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.warn(`⚠️  Request timed out for ${url}`);
      return null;
    }
    console.warn(`⚠️  Request failed for ${url}:`, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

async function callModel(
  content: {
    link: string;
    existingName: string | null;
    html: string;
  },
  modelId: string
): Promise<EnrichedContent | null> {
  const { link, existingName, html } = content;

  const pageTitle = extractTitle(html);
  const metaDescription = extractMeta(html, "description");
  const ogTitle = extractMeta(html, "og:title");
  const ogDescription = extractMeta(html, "og:description");
  const textSample = truncate(stripTags(html), 4000);

  const systemPrompt = `You are an expert SaaS copywriter. Craft polished, factually grounded English marketing copy from scraped website content.`;

  const guidance = [
    "Return a strict JSON object with keys: name, description, introduce.",
    "name: Refine the provided candidate or derive a concise brand-friendly site name (Title Case).",
    "description: 1-2 sentences, concise overview highlighting clear value and differentiators.",
    "introduce: 1000-4000 words in Markdown with multiple sections (## headers), bullet lists, and numbered steps when useful.",
    "Keep tone professional and confident. Do not invent features that have no evidence; acknowledge gaps if the site lacks detail while staying within word counts.",
    "Only produce English text. Escape double quotes in JSON values with a backslash.",
  ].join("\n");

  const context = [
    `Link: ${link}`,
    existingName ? `Existing name: ${existingName}` : "Existing name: (none)",
    pageTitle ? `Page title: ${pageTitle}` : "Page title: (none)",
    metaDescription
      ? `Meta description: ${metaDescription}`
      : "Meta description: (none)",
    ogTitle ? `OG title: ${ogTitle}` : "OG title: (none)",
    ogDescription
      ? `OG description: ${ogDescription}`
      : "OG description: (none)",
    "Extracted text (truncated):",
    textSample || "(no readable text extracted)",
  ].join("\n");

  const payload = {
    model: modelId,
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${guidance}\n\n${context}\n\nRespond with valid JSON only.`,
      },
    ],
  };

  const userPrompt = payload.messages[1]?.content ?? "";
  console.log("   🔧 Model request", {
    provider,
    endpoint,
    model: modelId,
    userPromptCharacters: userPrompt.length,
  });
  console.log(
    "   🔧 User prompt preview:\n",
    userPrompt.length > 800
      ? `${userPrompt.slice(0, 800)}\n… [truncated]`
      : userPrompt
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("❌ Model API error:", response.status, response.statusText);
    console.error(body);

    const lowerBody = body.toLowerCase();
    if (
      response.status === 404 ||
      lowerBody.includes("no endpoints found") ||
      lowerBody.includes("model not found")
    ) {
      console.error(
        `ℹ️  Model "${modelId}" is unavailable for provider "${provider}". Set MODEL_PROVIDER/MODEL_BASE_URL to match your account or pass --model <id> when running the script.`
      );
    }
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: { content?: string };
    }>;
  };

  const raw = data.choices?.[0]?.message?.content ?? "";
  const sanitized = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  console.log("   📩 Raw model response:\n", sanitized);

  try {
    const parsed = JSON.parse(sanitized) as EnrichedContent;
    if (!parsed.description || !parsed.introduce) {
      console.warn("⚠️  Model response missing required fields");
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("❌ Failed to parse model response:", error);
    console.error("Response was:", sanitized);
    return null;
  }
}

async function detectColumns(): Promise<{
  hasDescription: boolean;
  detailColumn: "introduce" | "introduction" | null;
  hasName: boolean;
  hasUpdatedAt: boolean;
}> {
  const columns = await sql<[{ column_name: string }]>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sites'
  `;

  const columnNames = columns.map((item) => item.column_name);
  const detailColumn = columnNames.includes("introduce")
    ? "introduce"
    : columnNames.includes("introduction")
    ? "introduction"
    : null;

  return {
    hasDescription: columnNames.includes("description"),
    detailColumn,
    hasName: columnNames.includes("name"),
    hasUpdatedAt: columnNames.includes("updated_at"),
  };
}

async function loadCandidateSites(
  limit: number,
  columns: {
    hasDescription: boolean;
    detailColumn: "introduce" | "introduction" | null;
    hasName: boolean;
  }
): Promise<SiteRow[]> {
  const selectFields = ["id", "link"];
  if (columns.hasName) {
    selectFields.push("name");
  }
  if (columns.hasDescription) {
    selectFields.push("description");
  }
  if (columns.detailColumn) {
    selectFields.push(`"${columns.detailColumn}"`);
  }

  const needs: string[] = [];
  if (columns.hasDescription) {
    needs.push("description IS NULL OR btrim(description) = ''");
  }
  if (columns.detailColumn) {
    needs.push(
      `"${columns.detailColumn}" IS NULL OR btrim("${columns.detailColumn}") = ''`
    );
  }
  if (columns.hasName) {
    needs.push("name IS NULL OR btrim(name) = ''");
  }

  if (needs.length === 0) {
    console.error(
      "❌ sites table is missing required columns (description/name/introduce)"
    );
    process.exit(1);
  }

  const baseQuery = `
    SELECT ${selectFields.join(", ")}
    FROM public.sites
    WHERE link IS NOT NULL AND btrim(link) <> ''
      AND (${needs.join(" OR ")})
    ORDER BY id ASC
    ${Number.isFinite(limit) ? `LIMIT ${limit}` : ""}
  `;

  const rows = (await sql.unsafe(baseQuery)) as SiteRow[];
  return rows;
}

function pickDetailValue(site: SiteRow): string | null {
  return cleanText(site.introduce) ?? cleanText(site.introduction);
}

async function updateSite(
  siteId: number,
  payload: Record<string, unknown>,
  hasUpdatedAt: boolean
) {
  if (Object.keys(payload).length === 0) {
    return;
  }

  const updatePayload: Record<string, unknown> = { ...payload };
  if (hasUpdatedAt) {
    updatePayload.updated_at = sql`now()`;
  }

  await sql`
    UPDATE public.sites
    SET ${sql(updatePayload)}
    WHERE id = ${siteId}
  `;
}

async function main() {
  const options = parseCliOptions();
  const selectedModel = options.model ?? fallbackModel;
  console.log("🚀 Starting site enrichment", {
    provider,
    model: selectedModel,
    limit: Number.isFinite(options.limit) ? options.limit : "all",
    retry: options.retry,
    dryRun: options.dryRun,
  });

  const columns = await detectColumns();
  console.log("ℹ️  Detected sites columns:", columns);

  const sites = await loadCandidateSites(options.limit, columns);

  if (sites.length === 0) {
    console.log("✅ No sites require enrichment");
    await sql.end();
    return;
  }

  console.log(`📋 Found ${sites.length} site(s) needing updates`);

  for (const site of sites) {
    const normalizedUrl = normalizeUrl(site.link);
    if (!normalizedUrl) {
      console.warn(`⚠️  Invalid URL for site ${site.id}: ${site.link}`);
      continue;
    }

    console.log(`\n➡️  Processing site ${site.id} (${normalizedUrl})`);

    const existingDescription = cleanText(site.description ?? null);
    const existingDetail = pickDetailValue(site);
    const existingName = cleanText(site.name ?? null);

    const needsDescription = columns.hasDescription && !existingDescription;
    const needsDetail = Boolean(columns.detailColumn) && !existingDetail;
    const needsName = columns.hasName && !existingName;

    if (!needsDescription && !needsDetail && !needsName) {
      console.log("   ↪︎ Nothing to update, skipping.");
      continue;
    }

    const html = await fetchHtml(normalizedUrl);
    if (!html) {
      console.log("   ↪︎ Unable to fetch HTML, skipping.");
      continue;
    }

    let aiResult: EnrichedContent | null = null;
    for (let attempt = 0; attempt <= options.retry; attempt += 1) {
      aiResult = await callModel(
        {
          link: normalizedUrl,
          existingName: existingName ?? null,
          html,
        },
        selectedModel
      );

      if (aiResult) {
        console.log(`   ✅ AI response received on attempt ${attempt + 1}`);
        break;
      }

      console.warn(`   ⚠️  AI generation failed (attempt ${attempt + 1})`);
    }

    if (!aiResult) {
      console.warn("   ⚠️  Unable to generate content after retries");
      continue;
    }

    const descWords = countWords(aiResult.description);
    const introWords = countWords(aiResult.introduce);

    console.log(
      `   🧾 AI content summary → description words: ${descWords}, introduce words: ${introWords}`
    );
    console.log(
      "   🧾 AI name:",
      aiResult.name ?? existingName ?? "(not provided)"
    );
    console.log("   🧾 AI description:\n", aiResult.description);
    console.log("   🧾 AI introduce (markdown):\n", aiResult.introduce);

    const updatePayload: Record<string, unknown> = {};

    if (needsDescription) {
      updatePayload.description = aiResult.description.trim();
    }

    if (needsDetail && columns.detailColumn) {
      updatePayload[columns.detailColumn] = aiResult.introduce.trim();
    }

    if (needsName) {
      updatePayload.name =
        aiResult.name?.trim() || extractTitle(html) || existingName || null;
    }

    if (options.dryRun) {
      console.log("   💾 Dry run — would update with:", updatePayload);
      continue;
    }

    await updateSite(site.id, updatePayload, columns.hasUpdatedAt);
    console.log("   ✅ Updated site", updatePayload);
  }

  await sql.end();
  console.log("🏁 Finished site enrichment");
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  sql.end({ timeout: 1 }).catch(() => undefined);
  process.exit(1);
});
