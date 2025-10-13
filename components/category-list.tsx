"use client";

import { DEFAULT_CATEGORIES } from "@/lib/fallback-data";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  categories?: string[];
  selectedCategory?: string | null;
  showAll?: boolean;
  onCategoryChange?: (category: string | null) => void;
  className?: string;
}

const baseClasses =
  "cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition";
const activeClasses =
  "border-[#ff7d68] bg-[#ff7d68] text-white shadow-[0_10px_25px_-18px_rgba(255,125,104,1)]";
const inactiveClasses =
  "border-[#e8e8ec] bg-white text-[#616168] hover:border-[#ffb8aa] hover:text-[#ff7d68]";

export function CategoryList({
  categories = DEFAULT_CATEGORIES,
  selectedCategory = null,
  showAll = true,
  onCategoryChange,
  className,
}: CategoryListProps) {
  const handleCategoryClick = (category: string | null) => {
    onCategoryChange?.(category);
  };

  const items = Array.from(new Set(categories.filter(Boolean)));

  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {showAll && (
        <button
          type="button"
          onClick={() => handleCategoryClick(null)}
          className={cn(
            baseClasses,
            selectedCategory === null ? activeClasses : inactiveClasses,
          )}
          aria-pressed={selectedCategory === null}
        >
          All
        </button>
      )}
      {items.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            type="button"
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
            aria-pressed={isActive}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
