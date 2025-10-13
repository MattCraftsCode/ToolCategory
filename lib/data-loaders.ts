import { asc } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/lib/db";
import { categories, tags } from "@/lib/db/schema";
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from "@/lib/fallback-data";

const logError = (context: string, error: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[data-loaders] ${context}`, error);
  }
};

export const getCategories = cache(async (): Promise<string[]> => {
  try {
    const results = await db
      .select({ name: categories.name })
      .from(categories)
      .orderBy(asc(categories.name));

    const names = results
      .map((entry) => entry.name)
      .filter((name): name is string => Boolean(name));

    if (names.length > 0) {
      return names;
    }
  } catch (error) {
    logError("getCategories", error);
  }

  return DEFAULT_CATEGORIES;
});

export const getTags = cache(async (): Promise<string[]> => {
  try {
    const results = await db
      .select({ name: tags.name })
      .from(tags)
      .orderBy(asc(tags.name));

    const names = results
      .map((entry) => entry.name)
      .filter((name): name is string => Boolean(name));

    if (names.length > 0) {
      return names;
    }
  } catch (error) {
    logError("getTags", error);
  }

  return DEFAULT_TAGS;
});
