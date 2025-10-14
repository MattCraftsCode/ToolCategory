"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { BackToTopButton } from "@/components/back-to-top-button";
import { CategoryList } from "@/components/category-list";
import { MultiSelect } from "@/components/multi-select";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from "@/lib/fallback-data";
import { slugify } from "@/lib/utils";

type CategoryTool = {
  name: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
  addedAt: string;
};

type CategoryOption = {
  name: string;
  slug: string;
};

const defaultCategoryOptions: CategoryOption[] = DEFAULT_CATEGORIES.map((name) => ({
  name,
  slug: slugify(name),
}));

const categoryTools: CategoryTool[] = [
  {
    name: "Photo Enhancer",
    description:
      "Enhance your photos online for free. Increase image quality, sharpen details, and remove noise with one-click adjustments.",
    category: "Image",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Image", "AI Enhancer", "Creative Suite"],
    featured: true,
    addedAt: "2025-02-12T07:30:00.000Z",
  },
  {
    name: "Tool Journey",
    description:
      "Discover productivity-enhancing software and tools that accompany your workflow from ideation to launch.",
    category: "Productivity",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Productivity", "Management", "Marketing"],
    featured: true,
    addedAt: "2025-02-10T10:15:00.000Z",
  },
  {
    name: "UR Temp Mail",
    description:
      "Get free, instant temporary email addresses to protect your inbox and stay anonymous while testing new products.",
    category: "Security",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    tags: ["Privacy", "Utilities", "Daily Life"],
    addedAt: "2025-01-28T14:05:00.000Z",
  },
  {
    name: "BacklinkHelper",
    description:
      "Streamline backlink management with automated outreach, weekly reporting, and SEO insights tailored for marketers.",
    category: "Marketing",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    tags: ["Writing", "Marketing", "Management"],
    addedAt: "2025-01-22T09:45:00.000Z",
  },
  {
    name: "PromptMaster Studio",
    description:
      "Design reusable prompt templates, collaborate with your team, and deploy AI workflows across your favorite tools.",
    category: "AI",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tags: ["AI", "Writing", "Automation"],
    addedAt: "2025-01-18T08:12:00.000Z",
  },
  {
    name: "BudgetFlow",
    description:
      "Automate budgeting, forecasting, and reporting with dashboards that give finance teams real-time clarity.",
    category: "Finance",
    image:
      "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1200&q=80",
    tags: ["Finance", "Analytics", "Productivity"],
    addedAt: "2025-01-08T11:30:00.000Z",
  },
  {
    name: "PalettePilot",
    description:
      "Generate harmonious color palettes, preview them in UI mockups, and export tokens instantly to your design system.",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    tags: ["Design", "Branding", "Inspiration"],
    featured: true,
    addedAt: "2024-12-30T15:55:00.000Z",
  },
  {
    name: "VoxNote",
    description:
      "Turn voice notes into organized documents with automatic summaries, topic tags, and collaboration-ready exports.",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Audio", "Transcription", "Productivity"],
    addedAt: "2024-12-18T13:20:00.000Z",
  },
  {
    name: "AutomataHub",
    description:
      "Connect your SaaS stack, build no-code automations, and monitor performance with real-time alerts and analytics.",
    category: "Automation",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80",
    tags: ["Automation", "No Code", "Operations"],
    addedAt: "2024-12-05T17:10:00.000Z",
  },
];

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

function CategoryToolCard({ tool }: { tool: CategoryTool }) {
  return (
    <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-[#f0efef] bg-white shadow-[0_26px_50px_-40px_rgba(23,23,31,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_80px_-48px_rgba(23,23,31,0.55)]">
      <div className="group/image relative h-48 w-full overflow-hidden">
        <Image
          src={tool.image}
          alt={tool.name}
          fill
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 48vw, 100vw"
          className="object-cover transition duration-500 group-hover/image:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#1a1a1f] shadow-sm">
          {tool.category}
        </span>
        {tool.featured ? (
          <span className="absolute right-4 top-4 rounded-full bg-[#ff7d68] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        ) : null}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0d0f1a]/0 text-sm font-semibold uppercase tracking-[0.5em] text-white transition duration-300 group-hover/image:bg-[#0d0f1a]/45 group-hover/image:text-white">
          <span className="opacity-0 transition duration-300 group-hover/image:opacity-100">
            VIEW DETAIL
          </span>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col gap-4 px-6 py-6">
        <span className="pointer-events-none absolute right-6 top-4 text-xs font-semibold text-[#7f7f88] opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          Details →
        </span>
        <h3 className="pr-16 text-xl font-semibold tracking-tight text-[#17171c]">
          {tool.name}
        </h3>
        <p className="text-sm leading-relaxed text-[#616168]">
          {tool.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-3 text-xs font-medium text-[#7f7f88]">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="group/tag relative inline-flex items-center gap-1 pb-0.5 text-xs font-medium text-[#808089] transition-colors duration-200"
            >
              <span className="text-[#b3b3ba]">#</span>
              <span>{tag}</span>
              <span className="pointer-events-none absolute inset-x-1 bottom-0 h-0.5 origin-right scale-x-0 bg-current transition-transform duration-200 group-hover/tag:origin-left group-hover/tag:scale-x-100" />
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterPreset, setFilterPreset] = useState<FilterOption>("No Filter");
  const [sortOption, setSortOption] = useState<SortOption>("time-desc");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(
    defaultCategoryOptions,
  );
  const [tagOptions, setTagOptions] = useState<string[]>(DEFAULT_TAGS);

  useEffect(() => {
    let isMounted = true;

    const loadFilterOptions = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/tags", { cache: "no-store" }),
        ]);

        if (!isMounted) {
          return;
        }

        if (categoriesResponse.ok) {
          const data = (await categoriesResponse.json()) as {
            categories?: Array<{ name?: string; slug?: string } | string>;
          };
          if (Array.isArray(data?.categories) && data.categories.length > 0) {
            const mapped = data.categories
              .map((item) => {
                if (typeof item === "string") {
                  return { name: item, slug: slugify(item) } satisfies CategoryOption;
                }
                const name = typeof item?.name === "string" ? item.name : "";
                if (!name.trim()) {
                  return null;
                }
                const slug =
                  typeof item?.slug === "string" && item.slug.trim().length > 0
                    ? item.slug.trim()
                    : slugify(name);
                return { name, slug } satisfies CategoryOption;
              })
              .filter((entry): entry is CategoryOption => Boolean(entry && entry.name));

            if (mapped.length > 0) {
              setCategoryOptions(mapped);
            }
          }
        }

        if (tagsResponse.ok) {
          const data = (await tagsResponse.json()) as { tags?: string[] };
          if (Array.isArray(data?.tags) && data.tags.length > 0) {
            setTagOptions(data.tags);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to fetch category filters", error);
        }
      }
    };

    loadFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      selectedCategory &&
      !categoryOptions.some((option) => option.slug === selectedCategory)
    ) {
      setSelectedCategory(null);
    }
  }, [categoryOptions, selectedCategory]);

  useEffect(() => {
    setSelectedTags((previous) =>
      previous.filter((tag) => tagOptions.includes(tag)),
    );
  }, [tagOptions]);

const filteredTools = useMemo(() => {
    return categoryTools
      .filter((tool) => {
        if (selectedCategory && slugify(tool.category) !== selectedCategory) {
          return false;
        }

        if (selectedTags.length > 0) {
          const hasAllTags = selectedTags.every((tag) =>
            tool.tags.includes(tag),
          );
          if (!hasAllTags) {
            return false;
          }
        }

        if (filterPreset === "Featured" && !tool.featured) {
          return false;
        }

        if (searchTerm.trim().length > 0) {
          const normalized = searchTerm.trim().toLowerCase();
          const matchesName = tool.name.toLowerCase().includes(normalized);
          const matchesDescription = tool.description
            .toLowerCase()
            .includes(normalized);

          if (!matchesName && !matchesDescription) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "time-asc":
            return (
              new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
            );
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "time-desc":
          default:
            return (
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
            );
        }
      });
  }, [filterPreset, searchTerm, selectedCategory, selectedTags, sortOption]);

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
    setSelectedCategory(null);
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
              <span role="img" aria-label="megaphone">
                📣
              </span>
              Submit your product and build your fame
              <span className="text-base">→</span>
            </Link>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#17171c] sm:text-[3.15rem] sm:leading-[1.08]">
              Discover top <span className="text-[#ff7d68]">164</span> tools in 2025
            </h1>
            <p className="text-base text-[#63636a] sm:text-lg">
              Explore the best and newest online tools in 2025. Find the most popular online tools all in one place.
            </p>
          </section>

          <CategoryList
            className="mt-8"
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
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
                options={tagOptions}
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
                  <CategoryToolCard key={tool.name} tool={tool} />
                ))}
              </div>
              {visibleCount < filteredTools.length ? (
                <div ref={loadMoreRef} className="h-12 w-full" />
              ) : null}
            </>
          ) : (
            <p className="mt-12 text-center text-sm text-[#7f7f88]">
              Try adjusting your search or filter selections to discover more tools.
            </p>
          )}
        </main>
      </div>

      <SiteFooter />

      <BackToTopButton className="right-4" />
    </div>
  );
}
