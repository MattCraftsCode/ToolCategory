import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

const TOOLCATEGORY_DOMAIN = "https://toolcategory.com/";
const BADGE_SOURCE = "https://toolcategory.com/badge-light.svg";
const REQUIRED_BADGE_ALT = "Featured on ToolCategory.com";

const TAG_ATTRIBUTE_REGEX = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

function parseAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  let match: RegExpExecArray | null;
  while ((match = TAG_ATTRIBUTE_REGEX.exec(tag)) !== null) {
    const [, rawName, doubleQuoted, singleQuoted] = match;
    const name = rawName.toLowerCase();
    const value = (doubleQuoted ?? singleQuoted ?? "").trim();
    attributes.set(name, value);
  }
  return attributes;
}

function hasBacklink(html: string): boolean {
  const anchorRegex = /<a\b[^>]*>/gi;
  const anchors = html.matchAll(anchorRegex);
  for (const match of anchors) {
    const attributes = parseAttributes(match[0]);
    const href = attributes.get("href");
    if (href && href.includes(TOOLCATEGORY_DOMAIN)) {
      return true;
    }
  }
  return false;
}

function hasRequiredBadge(html: string, expectedSrc: string): boolean {
  const imageRegex = /<img\b[^>]*>/gi;
  const images = html.matchAll(imageRegex);
  for (const match of images) {
    const attributes = parseAttributes(match[0]);
    const src = attributes.get("src");
    const alt = attributes.get("alt");
    if (src === expectedSrc && alt === REQUIRED_BADGE_ALT) {
      return true;
    }
  }
  return false;
}

function buildErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return buildErrorResponse("Invalid request payload.");
  }

  const rawUrl =
    typeof (payload as { url?: unknown })?.url === "string"
      ? (payload as { url: string }).url.trim()
      : "";
  const siteUuid =
    typeof (payload as { siteUuid?: unknown })?.siteUuid === "string"
      ? (payload as { siteUuid: string }).siteUuid.trim()
      : "";

  if (!rawUrl) {
    return buildErrorResponse("Provide a website URL to verify.");
  }

  if (!siteUuid) {
    return buildErrorResponse("Missing submission identifier.");
  }

  const expectedBadgeSrc = BADGE_SOURCE;

  let target: URL;
  try {
    target = new URL(rawUrl);
    if (target.protocol !== "http:" && target.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    return buildErrorResponse(
      "Enter a valid URL that starts with http:// or https://."
    );
  }

  try {
    const response = await fetch(target.href, {
      method: "GET",
      headers: {
        "User-Agent": "ToolCategoryBadgeBot/1.0 (+https://toolcategory.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      return buildErrorResponse(
        "We couldn’t fetch the provided website. Please try again later.",
        502
      );
    }

    const html = (await response.text()).slice(0, 1_000_000);

    const errors: string[] = [];

    if (!hasBacklink(html)) {
      errors.push("Add a link pointing to https://toolcategory.com/.");
    }

    if (!hasRequiredBadge(html, expectedBadgeSrc)) {
      errors.push(
        'Include the ToolCategory badge image with alt text "Featured on ToolCategory.com".'
      );
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const [updated] = await db
      .update(sites)
      .set({ isVerified: 1 })
      .where(eq(sites.uuid, siteUuid))
      .returning({ uuid: sites.uuid });

    if (!updated) {
      return buildErrorResponse("This submission could not be found.", 404);
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("[badge-verification] fetch failed", error);
    return buildErrorResponse(
      "We couldn’t reach the provided URL. Please try again later.",
      502
    );
  }
}
