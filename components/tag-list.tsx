"use client";

import Link from "next/link";

import { cn, slugify } from "@/lib/utils";

type TagListItem = {
  name: string;
  slug: string;
};

type TagInput = TagListItem | string;

type TagListProps = {
  tags?: TagInput[];
  selectedTag?: string | null;
  onTagChange?: (tagSlug: string | null) => void;
  showAll?: boolean;
  className?: string;
  emptyMessage?: string;
};

const baseClasses =
  "cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition";
const activeClasses =
  "border-[#ff7d68] bg-[#ff7d68] text-white shadow-[0_10px_25px_-18px_rgba(255,125,104,1)]";
const inactiveClasses =
  "border-[#e8e8ec] bg-white text-[#616168] hover:border-[#ffb8aa] hover:text-[#ff7d68]";

const toTagItem = (value: TagInput): TagListItem => {
  if (typeof value === "string") {
    return { name: value, slug: slugify(value) };
  }
  return {
    name: value.name,
    slug: value.slug?.trim().length ? value.slug : slugify(value.name),
  };
};

export function TagList({
  tags = [],
  selectedTag = null,
  onTagChange,
  showAll = true,
  className,
  emptyMessage = "No tags available yet.",
}: TagListProps) {
  const normalized = Array.from(
    new Map(
      (tags ?? [])
        .map(toTagItem)
        .map((item) => [item.slug, item] as const),
    ).values(),
  );

  const isEmpty = normalized.length === 0;

  const renderButton = (item: TagListItem) => {
    const isActive = selectedTag === item.slug;
    return (
      <button
        type="button"
        key={item.slug}
        onClick={() => onTagChange?.(item.slug)}
        className={cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
        aria-pressed={isActive}
      >
        #{item.name}
      </button>
    );
  };

  const renderLink = (item: TagListItem, selected: string | null) => {
    const isActive = selected === item.slug;
    return (
      <Link
        key={item.slug}
        href={`/tag/${item.slug}`}
        className={cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
        aria-current={isActive ? "page" : undefined}
      >
        #{item.name}
      </Link>
    );
  };

  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {isEmpty ? (
        <p className="rounded-full border border-dashed border-[#e8e8ec] px-5 py-2 text-sm text-[#9a9aa3]">
          {emptyMessage}
        </p>
      ) : (
        <>
          {showAll && (
            onTagChange ? (
              <button
                type="button"
                onClick={() => onTagChange(null)}
                className={cn(
                  baseClasses,
                  selectedTag === null ? activeClasses : inactiveClasses,
                )}
                aria-pressed={selectedTag === null}
              >
                All tags
              </button>
            ) : (
              <Link
                href="/tag"
                className={cn(
                  baseClasses,
                  selectedTag === null ? activeClasses : inactiveClasses,
                )}
                aria-current={selectedTag === null ? "page" : undefined}
              >
                All tags
              </Link>
            )
          )}

          {normalized.map((item) =>
            onTagChange ? renderButton(item) : renderLink(item, selectedTag),
          )}
        </>
      )}
    </div>
  );
}
