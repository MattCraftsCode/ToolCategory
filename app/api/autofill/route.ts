import { NextResponse } from "next/server";

type AutofillRequest = {
  url?: string;
};

const DESCRIPTION_REGEX = /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i;
const OG_DESCRIPTION_REGEX = /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i;
const TITLE_REGEX = /<title>([^<]*)<\/title>/i;

export async function POST(request: Request) {
  let body: AutofillRequest;

  try {
    body = (await request.json()) as AutofillRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const inputUrl = body?.url?.trim();
  if (!inputUrl) {
    return NextResponse.json({ error: "Please provide a product link before using AI Autofill." }, { status: 422 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`);
  } catch {
    return NextResponse.json({ error: "That link doesn’t look valid. Double-check the URL and try again." }, { status: 422 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ToolCategoryBot/1.0; +https://toolcategory.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "We couldn’t reach that site just yet. Try again in a moment or fill the fields manually.",
        },
        { status: 502 },
      );
    }

    const html = await response.text();
    const pageTitle = matchFirst(html, TITLE_REGEX) ?? prettifyHost(targetUrl.hostname);
    const pageDescription =
      matchFirst(html, DESCRIPTION_REGEX) ??
      matchFirst(html, OG_DESCRIPTION_REGEX) ??
      `Discover what ${pageTitle} can do for you.`;

    const introduction = buildIntroduction({
      title: pageTitle,
      description: pageDescription,
      hostname: targetUrl.hostname,
    });

    return NextResponse.json({
      success: true,
      data: {
        name: decodeHTMLEntities(pageTitle).trim(),
        description: decodeHTMLEntities(pageDescription).trim(),
        introduction,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[autofill] failed to analyze", error);
    }
    return NextResponse.json(
      {
        error: "The AI assistant couldn’t analyze that link. Please check the URL or fill the details manually.",
      },
      { status: 500 },
    );
  }
}

function matchFirst(source: string, pattern: RegExp): string | null {
  const match = pattern.exec(source);
  return match?.[1]?.trim() ?? null;
}

function decodeHTMLEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function prettifyHost(host: string): string {
  return host.replace(/^www\./i, "")
    .split(".")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildIntroduction({
  title,
  description,
  hostname,
}: {
  title: string;
  description: string;
  hostname: string;
}): string {
  const cleanHost = prettifyHost(hostname);
  const overview = description.length > 0 ? description : `Learn what ${title} can do for your workflow.`;

  return [
    "## Overview",
    overview,
    "",
    "## Key Highlights",
    `- Trusted by teams who rely on ${cleanHost}`,
    "- Built to streamline creative and operational tasks",
    "- Simple setup, thoughtful experience",
    "",
    "## Getting Started",
    `1. Visit ${cleanHost} to create an account.`,
    "2. Explore the core features and invite collaborators.",
    "3. Share your feedback with the community once you launch.",
  ].join("\n");
}
