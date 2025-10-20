import Image from "next/image";
import Link from "next/link";

import type { HomePageTool } from "@/lib/data-loaders";
import { normalizeExternalUrl } from "@/lib/utils";

type ShowcaseToolCardProps = {
  tool: HomePageTool;
};

export function ShowcaseToolCard({ tool }: ShowcaseToolCardProps) {
  const detailHref = `/sites/${tool.slug}`;
  const websiteHref = normalizeExternalUrl(tool.link) ?? detailHref;
  const primaryCategory = tool.categories[0]?.name ?? "Uncategorized";
  const imageSrc =
    tool.image ??
    "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#f0efef] bg-white shadow-[0_26px_50px_-40px_rgba(23,23,31,0.35)] transition hover:-translate-y-1">
      <a
        href={websiteHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group/image relative block h-48 w-full overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={tool.name}
          fill
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 48vw, 100vw"
          className="object-cover transition duration-500 group-hover/image:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#1a1a1f] shadow-sm">
          {primaryCategory}
        </span>
        {tool.isFeatured ? (
          <span className="absolute right-4 top-4 rounded-full bg-[#ff7d68] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        ) : null}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0d0f1a]/0 text-sm font-semibold uppercase tracking-[0.5em] text-white transition duration-300 group-hover/image:bg-[#0d0f1a]/45">
          <span className="opacity-0 transition duration-300 group-hover/image:opacity-100">
            VIEW DETAIL
          </span>
        </div>
      </a>
      <div className="relative flex flex-1 flex-col px-6 py-6">
        <Link
          href={detailHref}
          aria-label={`View ${tool.name}`}
          className="group/detail relative flex flex-1 flex-col gap-3 rounded-[14px] text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7d68]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-[#17171c] transition-colors duration-200 group-hover/detail:text-[#ff7d68] truncate">
              {tool.name}
            </h3>
            <p className="text-sm leading-relaxed text-[#616168] line-clamp-2">
              {tool.description}
            </p>
          </div>
          <span className="pointer-events-none self-end text-xs font-semibold text-[#9a9aa3] opacity-0 transition-opacity duration-200 group-hover/detail:opacity-100">
            Details →
          </span>
        </Link>
        <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-[#7f7f88]">
          {tool.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#f7f7fb] px-3 py-1 text-xs font-medium text-[#808089] transition-colors duration-200 hover:bg-[#ffe8e2] hover:text-[#ff7d68]"
            >
              <span className="text-[#ff7d68]">#</span>
              <span>{tag.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
