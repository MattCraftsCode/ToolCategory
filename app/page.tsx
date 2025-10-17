import Image from "next/image";
import Link from "next/link";
import { Search, Sparkles, Star } from "lucide-react";

import { BackToTopButton } from "@/components/back-to-top-button";
import { CategoryList } from "@/components/category-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import type { HomePageTool } from "@/lib/data-loaders";
import { getCategories, getHomePageSections } from "@/lib/data-loaders";
import { cn, normalizeExternalUrl } from "@/lib/utils";

const imageGallery = [
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580894908171-dc2de66f2281?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512427691650-1e0c3d0adf80?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1458656310820-0ddae4b2588c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523294587484-bae6cc870010?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523473827534-86c21266fd79?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523966211575-eb4a15b148b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-656e2be1a2b4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1473090928358-00f7d7489c1b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472489735873-b17ba174818f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=1200&q=80",
];

const CTA_LABEL = "View All ->";

type ToolSection = {
  key: string;
  title: string;
  tools: HomePageTool[];
  ctaHref: string;
  isFeatured: boolean;
};

function getFallbackImage(seed: number): string {
  if (imageGallery.length === 0) {
    return "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";
  }
  const index = Math.abs(seed) % imageGallery.length;
  return imageGallery[index];
}

function ToolCard({
  tool,
  isFeatured,
}: {
  tool: HomePageTool;
  isFeatured?: boolean;
}) {
  const imageSrc = tool.image ?? getFallbackImage(tool.id);
  const isTagList = tool.tags.length > 0;
  const labels = isTagList ? tool.tags : tool.categories;
  const hasLabels = labels.length > 0;
  const detailHref = `/sites/${tool.slug}`;
  const externalHref = normalizeExternalUrl(tool.link);
  const canOpenExternal = Boolean(isFeatured && externalHref);

  const imageOverlay = (
    <>
      <Image
        src={imageSrc}
        alt={tool.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        className="object-cover transition-transform duration-300 ease-out group-hover/image:scale-105"
      />
      <div className="absolute inset-0 bg-[#0b1120]/0 transition-colors duration-300 ease-out group-hover/image:bg-[#0b1120]/45" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
        {canOpenExternal ? "VIEW WEBSITE" : "VIEW DETAILS"}
      </div>
    </>
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-[14px] border border-[#e9e9ed] bg-white">
      {canOpenExternal ? (
        <a
          href={externalHref ?? detailHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group/image relative block h-44 overflow-hidden"
        >
          {imageOverlay}
        </a>
      ) : (
        <Link
          href={detailHref}
          className="group/image relative block h-44 overflow-hidden"
        >
          {imageOverlay}
        </Link>
      )}

      <Link
        href={detailHref}
        className="relative block space-y-3 px-6 pb-6 pt-6"
      >
        <span className="pointer-events-none absolute right-6 top-3 text-xs font-semibold text-[#7f7f88] opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          Details →
        </span>
        <div className="flex items-center gap-2 text-lg font-semibold text-[#1f1f24]">
          {isFeatured ? (
            <Star className="h-4 w-4 text-[#ff7d68]" aria-hidden="true" />
          ) : (
            <span role="img" aria-label="bookmark" className="text-base">
              🔖
            </span>
          )}
          {tool.name}
        </div>
        <p
          className="line-clamp-2 text-sm leading-relaxed text-[#5a5a63]"
          title={tool.description}
        >
          {tool.description}
        </p>
      </Link>

      {hasLabels && (
        <div className="flex flex-wrap gap-2 px-6 pb-6 text-xs font-medium text-[#616168]">
          {labels.map((label) => (
            <Link
              key={`${tool.id}-${label.slug}`}
              href={
                isTagList ? `/tag/${label.slug}` : `/category/${label.slug}`
              }
              className="group/tag relative inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f9] px-3 py-1 text-[11px] uppercase tracking-wide text-[#616168] transition-colors duration-200 hover:bg-[#ffe8e2]"
            >
              <span className="text-[#ff7d68] transition-transform duration-200 group-hover/tag:scale-125">
                {isTagList ? "#" : "📂"}
              </span>
              <span>{label.name}</span>
              <span className="pointer-events-none absolute inset-x-2 bottom-0.5 h-0.5 origin-right scale-x-0 bg-[#ff7d68] transition-transform duration-200 group-hover/tag:origin-left group-hover/tag:scale-x-100" />
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

export default async function Home() {
  const [categoryItems, sectionsData] = await Promise.all([
    getCategories(),
    getHomePageSections(),
  ]);

  const featuredSection: ToolSection = {
    key: "featured",
    title: "Featured Tools",
    tools: sectionsData.featured,
    ctaHref: "/category?filter=featured",
    isFeatured: true,
  };

  const latestSection: ToolSection = {
    key: "latest",
    title: "Latest Tools",
    tools: sectionsData.latest,
    ctaHref: "/category",
    isFeatured: false,
  };

  const categorySections: ToolSection[] = sectionsData.categories
    .filter((section) => section.tools.length > 0)
    .map((section) => ({
      key: `category-${section.categoryId}`,
      title: section.categoryName,
      tools: section.tools,
      ctaHref: section.categorySlug
        ? `/category/${section.categorySlug}`
        : `/category?category=${encodeURIComponent(section.categoryName)}`,
      isFeatured: false,
    }));

  const toolSections: ToolSection[] = [
    featuredSection,
    latestSection,
    ...categorySections,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />

      <div className="mx-auto flex min-h-screen w-full max-w-[92rem] flex-col px-6 pb-20 pt-12 lg:px-12 xl:px-20">
        <main className="flex flex-1 flex-col items-center pt-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <Link
              href="/category"
              className="flex items-center gap-2 rounded-full border border-[#ffe0d6] bg-white px-5 py-2 text-sm font-medium text-[#ff7d68] shadow-[0_16px_40px_-30px_rgba(255,125,104,1)] transition hover:border-[#ffb8aa] hover:text-[#ff6b54]"
            >
              <span role="img" aria-label="party popper">
                🎉
              </span>
              5 New Tools Added This Week
              <span className="text-base">→</span>
            </Link>
            <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-[#17171c] sm:text-[3.35rem] sm:leading-[1.08]">
              Explore, <span className="text-[#1f1f1f]">Choose, and</span>
              <span className="text-[#ff7d68]"> Get Things Done!</span>
            </h1>
            <p className="max-w-4xl text-base text-[#63636a] sm:text-lg">
              ToolCategory.com helps you discover, organize, and showcase the
              best digital tools. Browse curated collections, follow the latest
              launches, and submit your product to reach more makers.
            </p>
            <div className="mt-2 flex h-14 w-full max-w-5xl items-center rounded-full border border-[#f0efef] bg-white px-4 transition-all duration-300 hover:border-[#ff7d68]/40 hover:shadow-[0_0_0_2px_rgba(255,125,104,0.08)] focus-within:border-[#ff7d68]/70 focus-within:shadow-[0_0_0_2px_rgba(255,125,104,0.15)]">
              <input
                aria-label="Search tools"
                className="h-full w-full rounded-full border-0 bg-transparent text-sm text-[#2d2d32] outline-none placeholder:text-[#b0b0b5] transition-colors duration-300 focus-visible:outline-none"
                placeholder="Search any products you need"
                type="search"
              />
              <Button className="ml-3 h-11 w-11 cursor-pointer rounded-full bg-[#ff7d68] p-0 text-white transition hover:bg-[#ff6b54]">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <CategoryList categories={categoryItems} className="mt-6" />
          </div>

          {toolSections.map((section, index) => {
            const hasTools = section.tools.length > 0;
            const toolsToRender = hasTools ? section.tools.slice(0, 8) : [];

            return (
              <section
                key={section.key}
                className={cn("w-full", index === 0 ? "mt-20" : "mt-16")}
              >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-lg font-semibold text-[#ff7d68]">
                    <Sparkles className="h-5 w-5" />
                    {section.title}
                  </div>
                  <Link
                    href={section.ctaHref}
                    className="flex items-center gap-2 text-sm font-medium text-[#ff7d68] transition hover:text-[#ff6b54]"
                  >
                    {CTA_LABEL}
                  </Link>
                </div>
                {hasTools ? (
                  <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                    {toolsToRender.map((tool) => (
                      <ToolCard
                        key={`${section.key}-${tool.slug}`}
                        tool={tool}
                        isFeatured={section.isFeatured}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-10 rounded-xl border border-dashed border-[#e9e9ed] bg-white px-6 py-12 text-center text-sm text-[#7f7f88]">
                    No tools available yet.
                  </div>
                )}
              </section>
            );
          })}
        </main>
      </div>

      <SiteFooter />

      <BackToTopButton />
    </div>
  );
}
