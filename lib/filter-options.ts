import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from "@/lib/fallback-data";
import { slugify } from "@/lib/utils";

export type FilterCategory = {
  name: string;
  slug: string;
};

let cachedCategories: FilterCategory[] | null = null;
let cachedTags: string[] | null = null;
let loadPromise: Promise<void> | null = null;

const mapCategoryItems = (items: Array<{ name?: string; slug?: string } | string>) =>
  items
    .map((item) => {
      if (typeof item === "string") {
        return { name: item, slug: slugify(item) } satisfies FilterCategory;
      }
      const name = typeof item?.name === "string" ? item.name : "";
      if (!name.trim()) {
        return null;
      }
      const slug =
        typeof item?.slug === "string" && item.slug.trim().length > 0
          ? item.slug.trim()
          : slugify(name);
      return { name, slug } satisfies FilterCategory;
    })
    .filter((entry): entry is FilterCategory => Boolean(entry && entry.name));

async function fetchFilterOptions() {
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/tags", { cache: "no-store" }),
        ]);

        if (categoriesResponse.ok) {
          const data = (await categoriesResponse.json()) as {
            categories?: Array<{ name?: string; slug?: string } | string>;
          };
          if (Array.isArray(data?.categories) && data.categories.length > 0) {
            const mapped = mapCategoryItems(data.categories);
            if (mapped.length > 0) {
              cachedCategories = mapped;
            }
          }
        }

        if (tagsResponse.ok) {
          const data = (await tagsResponse.json()) as { tags?: string[] };
          if (Array.isArray(data?.tags) && data.tags.length > 0) {
            cachedTags = data.tags;
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to fetch filter options", error);
        }
      } finally {
        loadPromise = null;
      }
    })();
  }

  const promise = loadPromise;
  if (promise) {
    await promise;
  }
}

export async function ensureFilterOptions(): Promise<{
  categories: FilterCategory[];
  tags: string[];
}> {
  if (!cachedCategories) {
    cachedCategories = DEFAULT_CATEGORIES.map((name) => ({
      name,
      slug: slugify(name),
    }));
  }
  if (!cachedTags) {
    cachedTags = DEFAULT_TAGS;
  }

  await fetchFilterOptions();

  return {
    categories: cachedCategories ?? [],
    tags: cachedTags ?? [],
  };
}
