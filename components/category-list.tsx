"use client";

import Link from "next/link";

import { DEFAULT_CATEGORIES } from "@/lib/fallback-data";
import { cn, slugify } from "@/lib/utils";

type CategoryListItem = {
  name: string;
  slug: string;
};

type CategoryInput = CategoryListItem | string;

interface CategoryListProps {
  categories?: CategoryInput[];
  selectedCategory?: string | null;
  showAll?: boolean;
  onCategoryChange?: (categorySlug: string | null) => void;
  className?: string;
}

const baseClasses =
  "cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition";
const activeClasses =
  "border-[#ff7d68] bg-[#ff7d68] text-white shadow-[0_10px_25px_-18px_rgba(255,125,104,1)]";
const inactiveClasses =
  "border-[#e8e8ec] bg-white text-[#616168] hover:border-[#ffb8aa] hover:text-[#ff7d68]";

const toCategoryItem = (value: CategoryInput): CategoryListItem => {
  if (typeof value === "string") {
    return { name: value, slug: slugify(value) };
  }
  return {
    name: value.name,
    slug: value.slug?.trim().length ? value.slug : slugify(value.name),
  };
};

export function CategoryList({
  categories = DEFAULT_CATEGORIES,
  selectedCategory = null,
  showAll = true,
  onCategoryChange,
  className,
}: CategoryListProps) {
  const normalized = Array.from(
    new Map(
      (categories ?? DEFAULT_CATEGORIES)
        .map(toCategoryItem)
        .map((item) => [item.slug, item] as const),
    ).values(),
  );

  const renderButton = (item: CategoryListItem) => {
    const isActive = selectedCategory === item.slug;
    return (
      <button
        type="button"
        key={item.slug}
        onClick={() => onCategoryChange?.(item.slug)}
        className={cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
        aria-pressed={isActive}
      >
        {item.name}
      </button>
    );
  };

  const renderLink = (item: CategoryListItem) => (
    <Link
      key={item.slug}
      href={`/category/${item.slug}`}
      className={cn(baseClasses, inactiveClasses)}
    >
      {item.name}
    </Link>
  );

  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {showAll && (
        onCategoryChange ? (
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={cn(
              baseClasses,
              selectedCategory === null ? activeClasses : inactiveClasses,
            )}
            aria-pressed={selectedCategory === null}
          >
            All
          </button>
        ) : (
          <Link href="/category" className={cn(baseClasses, inactiveClasses)}>
            All
          </Link>
        )
      )}

      {normalized.map((item) =>
        onCategoryChange ? renderButton(item) : renderLink(item),
      )}
    </div>
  );
}
