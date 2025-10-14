import { asc } from "drizzle-orm";

import type { HomePageTool, NamedSlug } from "@/lib/data-loaders";
import { getDiscoveryTools } from "@/lib/data-loaders";
import { db } from "@/lib/db";
import { categories, tags } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

const uniqueBySlug = (items: NamedSlug[]): NamedSlug[] => {
  const map = new Map<string, NamedSlug>();
  items.forEach((item) => {
    if (!item.slug) {
      return;
    }
    if (!map.has(item.slug)) {
      map.set(item.slug, item);
    }
  });
  return Array.from(map.values());
};

const normalizeNamedSlug = (
  name: string | null | undefined,
  slugValue: string | null | undefined,
): NamedSlug | null => {
  const trimmedName = name?.trim() ?? "";
  if (!trimmedName) {
    return null;
  }

  const trimmedSlug = slugValue?.trim();
  const slug = trimmedSlug && trimmedSlug.length > 0 ? trimmedSlug : slugify(trimmedName);

  return { name: trimmedName, slug };
};

export async function loadDiscoveryData(): Promise<{
  tools: HomePageTool[];
  categories: NamedSlug[];
  tags: NamedSlug[];
}> {
  const [tools, categoryRows, tagRows] = await Promise.all([
    getDiscoveryTools(),
    db
      .select({ name: categories.name, slug: categories.slug })
      .from(categories)
      .orderBy(asc(categories.name)),
    db
      .select({ name: tags.name, slug: tags.slug })
      .from(tags)
      .orderBy(asc(tags.name)),
  ]);

  const categoryItems = uniqueBySlug(
    categoryRows
      .map((row) => normalizeNamedSlug(row.name, row.slug))
      .filter((entry): entry is NamedSlug => Boolean(entry)),
  );

  const tagItems = uniqueBySlug(
    tagRows
      .map((row) => normalizeNamedSlug(row.name, row.slug))
      .filter((entry): entry is NamedSlug => Boolean(entry)),
  );

  return {
    tools,
    categories: categoryItems,
    tags: tagItems,
  };
}
