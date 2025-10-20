import { NextResponse } from "next/server";

import { loadDiscoveryData } from "@/lib/tag-page-data";

const DEFAULT_SITE_URL = "https://toolcategory.com";

const xmlEscape = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildUrl = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const createUrlElement = (loc: string): string => `    <url>\n      <loc>${xmlEscape(loc)}</loc>\n    </url>`;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

  const { tools, categories, tags } = await loadDiscoveryData();

  const urls: string[] = [];

  urls.push(createUrlElement(buildUrl(baseUrl, "/")));

  for (const tool of tools) {
    urls.push(createUrlElement(buildUrl(baseUrl, `/sites/${tool.slug}`)));
  }

  for (const category of categories) {
    urls.push(createUrlElement(buildUrl(baseUrl, `/category/${category.slug}`)));
  }

  for (const tag of tags) {
    urls.push(createUrlElement(buildUrl(baseUrl, `/tag/${tag.slug}`)));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

