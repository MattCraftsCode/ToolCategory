import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/lib/db";
import { categories, siteCategories, siteTags, sites, tags, users } from "@/lib/db/schema";
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from "@/lib/fallback-data";
import { slugify } from "@/lib/utils";

const logError = (context: string, error: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[data-loaders] ${context}`, error);
  }
};

export type NamedSlug = {
  name: string;
  slug: string;
};

const DEFAULT_CATEGORY_ITEMS: NamedSlug[] = DEFAULT_CATEGORIES.map((name) => ({
  name,
  slug: slugify(name),
}));

const DEFAULT_TAG_ITEMS = DEFAULT_TAGS;

const ensureNamedSlug = (
  name: string | null | undefined,
  slugValue: string | null | undefined,
): NamedSlug | null => {
  if (!name) {
    return null;
  }
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return null;
  }
  const trimmedSlug = slugValue?.trim();
  const slug = trimmedSlug && trimmedSlug.length > 0 ? trimmedSlug : slugify(trimmedName);
  return { name: trimmedName, slug };
};

export const getCategories = cache(async (): Promise<NamedSlug[]> => {
  try {
    const results = await db
      .select({ name: categories.name, slug: categories.slug })
      .from(categories)
      .orderBy(asc(categories.name));

    const items = results
      .map((entry) => ensureNamedSlug(entry.name, entry.slug))
      .filter((entry): entry is NamedSlug => Boolean(entry));

    if (items.length > 0) {
      return items;
    }
  } catch (error) {
    logError("getCategories", error);
  }

  return DEFAULT_CATEGORY_ITEMS;
});

export const getTags = cache(async (): Promise<string[]> => {
  try {
    const results = await db
      .select({ name: tags.name })
      .from(tags)
      .orderBy(asc(tags.name));

    const items = results
      .map((entry) => entry.name)
      .filter((name): name is string => Boolean(name));

    if (items.length > 0) {
      return items;
    }
  } catch (error) {
    logError("getTags", error);
  }

  return DEFAULT_TAG_ITEMS;
});

const HOMEPAGE_SECTION_SIZE = 8;

type SiteRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  introduction: string | null;
  image: string | null;
  link: string | null;
  createdAt: Date | null;
  userId: string | null;
};

type SiteSection = {
  categoryId: number;
  categoryName: string;
  categorySlug: string | null;
  site: SiteRow;
};

type SiteCategoryMap = Record<number, NamedSlug[]>;
type SiteTagMap = Record<number, NamedSlug[]>;

export type HomePageTool = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  link: string | null;
  tags: NamedSlug[];
  categories: NamedSlug[];
  createdAt: Date | null;
};

export type HomePageCategorySection = {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  tools: HomePageTool[];
};

export type HomePageSections = {
  featured: HomePageTool[];
  latest: HomePageTool[];
  categories: HomePageCategorySection[];
};

function resolveDescription(row: SiteRow): string {
  const candidates = [row.description, row.introduction];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return "Description coming soon.";
}

function addToMap(
  map: Record<number, NamedSlug[]>,
  siteId: number | null | undefined,
  item: NamedSlug | null,
) {
  if (!siteId || !item) {
    return;
  }
  const list = map[siteId] ?? (map[siteId] = []);
  if (!list.some((existing) => existing.slug === item.slug)) {
    list.push(item);
  }
}

function extractHostLabel(link: string | null): { label: string; title: string } {
  if (!link) {
    return { label: "toolcategory.com", title: "ToolCategory" };
  }

  const normalize = (value: string) =>
    value
      .split(".")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");

  try {
    const url = new URL(link.startsWith("http") ? link : `https://${link}`);
    const hostname = url.hostname.replace(/^www\./i, "");
    return {
      label: hostname || link,
      title: normalize(hostname || link),
    };
  } catch {
    return { label: link, title: normalize(link) };
  }
}

async function loadSiteMetadata(siteIds: number[]): Promise<{
  categoriesMap: SiteCategoryMap;
  tagsMap: SiteTagMap;
}> {
  if (siteIds.length === 0) {
    return { categoriesMap: {}, tagsMap: {} };
  }

  try {
    const [categoryRows, tagRows] = await Promise.all([
      db
        .select({
          siteId: siteCategories.siteId,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(siteCategories)
        .innerJoin(categories, eq(siteCategories.categoryId, categories.id))
        .where(inArray(siteCategories.siteId, siteIds))
        .orderBy(asc(categories.name)),
      db
        .select({
          siteId: siteTags.siteId,
          tagName: tags.name,
          tagSlug: tags.slug,
        })
        .from(siteTags)
        .innerJoin(tags, eq(siteTags.tagId, tags.id))
        .where(inArray(siteTags.siteId, siteIds))
        .orderBy(asc(tags.name)),
    ]);

    const categoriesMap: SiteCategoryMap = {};
    for (const row of categoryRows) {
      addToMap(categoriesMap, row.siteId, ensureNamedSlug(row.categoryName, row.categorySlug));
    }

    const tagsMap: SiteTagMap = {};
    for (const row of tagRows) {
      addToMap(tagsMap, row.siteId, ensureNamedSlug(row.tagName, row.tagSlug));
    }

    return { categoriesMap, tagsMap };
  } catch (error) {
    logError("loadSiteMetadata", error);
    return { categoriesMap: {}, tagsMap: {} };
  }
}

function mapSite(
  row: SiteRow,
  categoriesMap: SiteCategoryMap,
  tagsMap: SiteTagMap,
): HomePageTool {
  const categoryList = categoriesMap[row.id] ?? [];
  const tagList = tagsMap[row.id] ?? [];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: resolveDescription(row),
    image: row.image?.trim() ?? null,
    link: row.link?.trim() ?? null,
    tags: tagList,
    categories: categoryList,
    createdAt: row.createdAt,
  };
}

function normalizeSiteRows(rows: Partial<SiteRow>[]): SiteRow[] {
  return rows
    .filter((row): row is SiteRow =>
      typeof row.id === "number" &&
      typeof row.name === "string" &&
      typeof row.slug === "string"
    )
    .map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? null,
      introduction: row.introduction ?? null,
      image: row.image ?? null,
      link: row.link ?? null,
      createdAt: row.createdAt ?? null,
      userId: row.userId ?? null,
    }));
}

function normalizeSectionRows(rows: Partial<SiteSection>[]): SiteSection[] {
  return rows
    .filter((row): row is SiteSection =>
      typeof row.categoryId === "number" &&
      typeof row.categoryName === "string" &&
      typeof row.site?.id === "number"
    )
    .map((row) => ({
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      categorySlug: row.categorySlug ?? null,
      site: {
        id: row.site.id,
        name: row.site.name,
        slug: row.site.slug,
        description: row.site.description ?? null,
        introduction: row.site.introduction ?? null,
        image: row.site.image ?? null,
        link: row.site.link ?? null,
        createdAt: row.site.createdAt ?? null,
        userId: null,
      },
    }));
}

const SITE_BASE_SELECTION = {
  id: sites.id,
  name: sites.name,
  slug: sites.slug,
  description: sites.description,
  introduction: sites.introduction,
  image: sites.image,
  link: sites.link,
  createdAt: sites.createdAt,
  userId: sites.userId,
} satisfies Record<string, unknown>;

export const getHomePageSections = cache(async (): Promise<HomePageSections> => {
  try {
    const [featuredRowsRaw, latestRowsRaw] = await Promise.all([
      db
        .select(SITE_BASE_SELECTION)
        .from(sites)
        .where(eq(sites.isFeatured, true))
        .orderBy(desc(sites.updatedAt), desc(sites.createdAt))
        .limit(HOMEPAGE_SECTION_SIZE),
      db
        .select(SITE_BASE_SELECTION)
        .from(sites)
        .orderBy(desc(sites.createdAt))
        .limit(HOMEPAGE_SECTION_SIZE),
    ]);

    const categoriesRaw = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .orderBy(asc(categories.name));

    const categorySiteRowsRaw = await db
      .select({
        categoryId: siteCategories.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        site: SITE_BASE_SELECTION,
      })
      .from(siteCategories)
      .innerJoin(sites, eq(siteCategories.siteId, sites.id))
      .innerJoin(categories, eq(siteCategories.categoryId, categories.id))
      .orderBy(asc(categories.name), desc(sites.createdAt));

    const featuredRows = normalizeSiteRows(featuredRowsRaw);
    const latestRows = normalizeSiteRows(latestRowsRaw);
    const categorySiteRows = normalizeSectionRows(categorySiteRowsRaw);

    const siteIds = new Set<number>();

    for (const row of featuredRows) {
      siteIds.add(row.id);
    }
    for (const row of latestRows) {
      siteIds.add(row.id);
    }
    for (const row of categorySiteRows) {
      siteIds.add(row.site.id);
    }

    const { categoriesMap, tagsMap } = await loadSiteMetadata(Array.from(siteIds));

    const featured = featuredRows.map((row) =>
      mapSite(row, categoriesMap, tagsMap),
    );
    const latest = latestRows.map((row) =>
      mapSite(row, categoriesMap, tagsMap),
    );

    const categoryLookup = new Map<number, { name: string; slug: string; tools: SiteRow[] }>();
    for (const categoryRow of categoriesRaw) {
      if (typeof categoryRow.id === "number" && typeof categoryRow.name === "string") {
        const slug = ensureNamedSlug(categoryRow.name, categoryRow.slug)?.slug ?? slugify(categoryRow.name);
        categoryLookup.set(categoryRow.id, { name: categoryRow.name, slug, tools: [] });
      }
    }

    for (const row of categorySiteRows) {
      const entry = categoryLookup.get(row.categoryId);
      if (!entry) {
        continue;
      }

      if (entry.tools.length >= HOMEPAGE_SECTION_SIZE) {
        continue;
      }

      entry.tools.push(row.site);
    }

    const categorySections: HomePageCategorySection[] = [];

    for (const [categoryId, entry] of categoryLookup) {
      if (entry.tools.length === 0) {
        continue;
      }

      const tools = entry.tools.map((tool) =>
        mapSite(tool, categoriesMap, tagsMap),
      );

      categorySections.push({
        categoryId,
        categoryName: entry.name,
        categorySlug: entry.slug,
        tools,
      });
    }

    return {
      featured,
      latest,
      categories: categorySections,
    };
  } catch (error) {
    logError("getHomePageSections", error);
    return {
      featured: [],
      latest: [],
      categories: [],
    };
  }
});

export type SiteDetail = {
  id: number;
  name: string;
  description: string;
  introductionMarkdown: string | null;
  image: string | null;
  link: string | null;
  createdAt: Date | null;
  categories: NamedSlug[];
  tags: NamedSlug[];
  publisherName: string;
  publisherAvatar: string | null;
  websiteLabel: string;
  related: HomePageTool[];
};

export const getSiteDetail = cache(async (slug: string): Promise<SiteDetail | null> => {
  try {
    const rows = await db
      .select(SITE_BASE_SELECTION)
      .from(sites)
      .where(eq(sites.slug, slug))
      .limit(1);

    const normalized = normalizeSiteRows(rows as Partial<SiteRow>[]);
    const site = normalized[0];

    if (!site) {
      return null;
    }

    const siteId = site.id;

    const categoryLinks = await db
      .select({ categoryId: siteCategories.categoryId })
      .from(siteCategories)
      .where(eq(siteCategories.siteId, siteId));

    const categoryIds = Array.from(
      new Set(
        categoryLinks
          .map((entry) => entry.categoryId)
          .filter((value): value is number => typeof value === "number"),
      ),
    );

    const relatedSiteRows: SiteRow[] = [];

    if (categoryIds.length > 0) {
      const relatedRaw = await db
        .select({ site: SITE_BASE_SELECTION })
        .from(siteCategories)
        .innerJoin(sites, eq(siteCategories.siteId, sites.id))
        .where(
          and(
            inArray(siteCategories.categoryId, categoryIds),
            ne(siteCategories.siteId, siteId),
          ),
        )
        .orderBy(asc(sites.createdAt))
        .limit(12);

      const normalizedRelated = normalizeSiteRows(
        relatedRaw.map((entry) => entry.site as Partial<SiteRow>),
      );

      const seen = new Set<number>();
      for (const row of normalizedRelated) {
        if (seen.has(row.id)) {
          continue;
        }
        seen.add(row.id);
        relatedSiteRows.push(row);
        if (relatedSiteRows.length === 3) {
          break;
        }
      }
    }

    const metadataSiteIds = [siteId, ...relatedSiteRows.map((row) => row.id)];
    const { categoriesMap, tagsMap } = await loadSiteMetadata(metadataSiteIds);

    let publisherName = "ToolCategory";
    let publisherAvatar: string | null = null;

    if (site.userId) {
      const publisherRows = await db
        .select({ name: users.name, image: users.image })
        .from(users)
        .where(eq(users.id, site.userId))
        .limit(1);

      const publisher = publisherRows[0];
      if (publisher?.name) {
        publisherName = publisher.name;
      }
      if (publisher?.image) {
        publisherAvatar = publisher.image;
      }
    }

    if (!site.userId || publisherName === "ToolCategory") {
      const hostMeta = extractHostLabel(site.link);
      if (hostMeta.title.trim().length > 0) {
        publisherName = hostMeta.title;
      }
    }

    const related = relatedSiteRows.map((row) =>
      mapSite(row, categoriesMap, tagsMap),
    );

    const hostInfo = extractHostLabel(site.link);

    return {
      id: site.id,
      name: site.name,
      description: resolveDescription(site),
      introductionMarkdown: site.introduction,
      image: site.image?.trim() ?? null,
      link: site.link?.trim() ?? null,
      createdAt: site.createdAt,
      categories: categoriesMap[siteId] ?? [],
      tags: tagsMap[siteId] ?? [],
      publisherName,
      publisherAvatar,
      websiteLabel: hostInfo.label,
      related,
    };
  } catch (error) {
    logError("getSiteDetail", error);
    return null;
  }
});
