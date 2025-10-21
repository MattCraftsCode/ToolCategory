"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Search, Sparkles, SearchX } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { ShowcaseToolCard } from "@/components/showcase-tool-card";
import { BackToTopButton } from "@/components/back-to-top-button";
import { CategoryList } from "@/components/category-list";
import { MultiSelect } from "@/components/multi-select";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { HomePageTool, NamedSlug } from "@/lib/data-loaders";

const PAGE_SIZE = 8;

const filterItems = [
  { label: "No Filter", value: "No Filter" as const },
  { label: "Featured", value: "Featured" as const },
];

const sortItems = [
  { label: "Sort by Time (dsc)", value: "time-desc" as const },
  { label: "Sort by Time (asc)", value: "time-asc" as const },
  { label: "Sort by Name (asc)", value: "name-asc" as const },
  { label: "Sort by Name (dsc)", value: "name-desc" as const },
];

type FilterOption = (typeof filterItems)[number]["value"];
type SortOption = (typeof sortItems)[number]["value"];

type CategoryPageContentProps = {
  initialCategorySlug?: string | null;
  tools: HomePageTool[];
  categoryOptions: NamedSlug[];
  tagOptions: NamedSlug[];
  footer?: ReactNode;
};

const uniqueBySlug = (items: NamedSlug[]): NamedSlug[] =>
  Array.from(new Map(items.map((item) => [item.slug, item] as const)).values());

export function CategoryPageContent({
  initialCategorySlug = null,
  tools,
  categoryOptions,
  tagOptions,
  footer,
}: CategoryPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const normalizedCategories = useMemo(
    () => uniqueBySlug(categoryOptions),
    [categoryOptions],
  );

  const normalizedTags = useMemo(
    () => uniqueBySlug(tagOptions),
    [tagOptions],
  );

  const tagNames = useMemo(
    () => normalizedTags.map((tag) => tag.name),
    [normalizedTags],
  );

  const selectedCategory = useMemo(() => {
    if (!initialCategorySlug) {
      return null;
    }
    const match = normalizedCategories.find(
      (category) => category.slug === initialCategorySlug,
    );
    return match?.slug ?? null;
  }, [initialCategorySlug, normalizedCategories]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterPreset, setFilterPreset] = useState<FilterOption>("No Filter");
  const [sortOption, setSortOption] = useState<SortOption>("time-desc");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedTags((previous) =>
      previous.filter((tag) => tagNames.includes(tag)),
    );
  }, [tagNames]);

  const filteredTools = useMemo(() => {
    const getTimestamp = (value: Date | null) => value?.getTime() ?? 0;

    return tools
      .filter((tool) => {
        if (
          selectedCategory &&
          !tool.categories.some((category) => category.slug === selectedCategory)
        ) {
          return false;
        }

        if (
          selectedTags.length > 0 &&
          !selectedTags.every((tagName) =>
            tool.tags.some((tag) => tag.name === tagName),
          )
        ) {
          return false;
        }

        if (filterPreset === "Featured" && !tool.isFeatured) {
          return false;
        }

        if (searchTerm.trim().length > 0) {
          const normalized = searchTerm.trim().toLowerCase();
          const matchesName = tool.name.toLowerCase().includes(normalized);
          const matchesDescription = tool.description
            .toLowerCase()
            .includes(normalized);
          const matchesTags = tool.tags.some((tag) =>
            tag.name.toLowerCase().includes(normalized),
          );

          if (!matchesName && !matchesDescription && !matchesTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "time-asc":
            return getTimestamp(a.createdAt) - getTimestamp(b.createdAt);
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "time-desc":
          default:
            return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
        }
      });
  }, [filterPreset, searchTerm, selectedCategory, selectedTags, sortOption, tools]);

  const [visibleCount, setVisibleCount] = useState(
    Math.min(PAGE_SIZE, filteredTools.length),
  );

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, filteredTools.length));
  }, [filteredTools]);

  useEffect(() => {
    if (visibleCount >= filteredTools.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisibleCount((previous) => {
            if (previous >= filteredTools.length) {
              return previous;
            }

            return Math.min(previous + PAGE_SIZE, filteredTools.length);
          });
        }
      },
      {
        rootMargin: "0px 0px 200px 0px",
        threshold: 0,
      },
    );

    const target = loadMoreRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [filteredTools.length, visibleCount]);

  const visibleTools = useMemo(
    () => filteredTools.slice(0, visibleCount),
    [filteredTools, visibleCount],
  );

  const hasResults = filteredTools.length > 0;

  const handleReset = () => {
    if (pathname !== "/category") {
      router.push("/category");
    }
    setSearchTerm("");
    setSelectedTags([]);
    setFilterPreset("No Filter");
    setSortOption("time-desc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff5f0] to-white text-[#1f1f1f]">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-[92rem] flex-col px-6 pb-24 pt-12 lg:px-12 xl:px-20">
        <main className="flex flex-1 flex-col items-center">
          <section className="flex w-full max-w-4xl flex-col items-center gap-4 text-center">
            <Link
              href="/submit"
              className="flex items-center gap-2 rounded-full border border-[#ffe0d6] bg-white px-5 py-2 text-sm font-medium text-[#ff7d68] shadow-[0_16px_40px_-30px_rgba(255,125,104,1)] transition hover:border-[#ffb8aa] hover:text-[#ff6b54]"
            >
              <span role="img" aria-label="sparkles">
                ✨
              </span>
              Explore by categories and surface your next favourite tool
              <span className="text-base">→</span>
            </Link>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#17171c] sm:text-[3.15rem] sm:leading-[1.08]">
              Discover tools by <span className="text-[#ff7d68]">category</span>
            </h1>
            <p className="text-base text-[#63636a] sm:text-lg">
              Jump into collections grouped by workflow and goal. Pick a category to see the tools teams rely on today.
            </p>
          </section>

          <CategoryList
            className="mt-8"
            categories={normalizedCategories}
            selectedCategory={selectedCategory}
            emptyMessage="暂无分类，欢迎提交你的工具。"
          />

          <div className="mt-10 w-full">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_auto]">
              <label className="flex h-12 items-center gap-3 rounded-full border border-[#f0efef] bg-white px-5 text-sm text-[#515156] transition hover:border-[#ff7d68]/40 focus-within:border-[#ff7d68]/70 focus-within:shadow-[0_0_0_2px_rgba(255,125,104,0.12)]">
                <span className="sr-only">Search tools</span>
                <Search className="h-5 w-5 text-[#b0b0b5]" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search..."
                  className="h-full w-full border-0 bg-transparent text-sm text-[#2d2d32] outline-none placeholder:text-[#b0b0b5]"
                />
              </label>

              <MultiSelect
                className="sm:col-span-1"
                placeholder="Select tags"
                options={tagNames}
                value={selectedTags}
                onChange={setSelectedTags}
                borderClassName="border-[#f0efef] hover:border-[#ff7d68]/40 focus:border-[#ff7d68]/70"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-12 w-full cursor-pointer items-center justify-between rounded-full border border-[#f0efef] bg-white px-5 text-sm text-[#515156] transition hover:border-[#ff7d68]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7d68]/20"
                  >
                    <span>{filterPreset}</span>
                    <ChevronDown className="h-4 w-4 text-[#b0b0b5]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border border-[#f0efef] bg-white p-1 shadow-[0_24px_40px_-32px_rgba(23,23,31,0.45)]">
                  {filterItems.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setFilterPreset(option.value)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-[#2d2d32] transition hover:bg-[#fff2ed] ${
                        filterPreset === option.value
                          ? "bg-[#fff2ed] font-semibold text-[#ff7d68]"
                          : ""
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-12 w-full cursor-pointer items-center justify-between rounded-full border border-[#f0efef] bg-white px-5 text-sm text-[#515156] transition hover:border-[#ff7d68]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7d68]/20"
                  >
                    <span>
                      {
                        sortItems.find((item) => item.value === sortOption)?.label ??
                        "Sort"
                      }
                    </span>
                    <ChevronDown className="h-4 w-4 text-[#b0b0b5]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border border-[#f0efef] bg-white p-1 shadow-[0_24px_40px_-32px_rgba(23,23,31,0.45)]">
                  {sortItems.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setSortOption(option.value)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-[#2d2d32] transition hover:bg-[#fff2ed] ${
                        sortOption === option.value
                          ? "bg-[#fff2ed] font-semibold text-[#ff7d68]"
                          : ""
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="h-12 rounded-full border border-[#f0efef] bg-white px-6 text-sm font-medium text-[#ff7d68] transition hover:border-[#ff7d68]/60 hover:bg-[#fff4f1]"
              >
                Reset
              </Button>
            </div>

            {tagNames.length === 0 ? (
              <p className="mt-4 text-sm text-[#7f7f88]">
                暂无标签可筛选，欢迎稍后再来探索。
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6b6b72]">
              <span>
                {hasResults
                  ? `Showing ${visibleTools.length} of ${filteredTools.length} curated tools`
                  : "No tools match your filters yet"}
              </span>
              {hasResults ? (
                <span className="flex items-center gap-2 text-[#ff7d68]">
                  <Sparkles className="h-4 w-4" /> Updated weekly
                </span>
              ) : null}
            </div>
          </div>

          {hasResults ? (
            <>
              <div className="mt-10 grid w-full gap-7 md:grid-cols-2 xl:grid-cols-4">
                {visibleTools.map((tool) => (
                  <ShowcaseToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
              {visibleCount < filteredTools.length ? (
                <div ref={loadMoreRef} className="h-12 w-full" />
              ) : null}
            </>
          ) : (
            <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#ffd1c6] bg-[#fff7f4] px-10 py-12 text-center">
              <SearchX className="h-10 w-10 text-[#ff7d68]" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-base font-semibold text-[#ff7d68]">
                  No tools match these filters
                </p>
                <p className="max-w-md text-sm text-[#7f7f88]">
                  Adjust the filters or clear them to rediscover every category highlight.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-[#ffb8aa] text-[#ff7d68] transition hover:border-[#ff7d68] hover:bg-[#fff1ec]"
              >
                Clear filters
              </Button>
            </div>
          )}
        </main>
      </div>

      {footer}

      <BackToTopButton className="right-4" />
    </div>
  );
}
