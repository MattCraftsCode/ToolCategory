import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

import { BackButton } from "@/components/back-button";
import { JoinTheCommunity } from "@/components/join-the-community";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { HomePageTool } from "@/lib/data-loaders";
import { getSiteDetail } from "@/lib/data-loaders";
import { cn, normalizeExternalUrl, slugify } from "@/lib/utils";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580894908171-dc2de66f2281?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80",
];

function getFallbackImage(index: number): string {
  if (FALLBACK_IMAGES.length === 0) {
    return "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function formatDate(date: Date | null): string | null {
  if (!date) {
    return null;
  }
  const formatted = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return formatted.replace(/-/g, "/");
}

function IconifyGlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Icon path sourced from Iconify (mdi:web) */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm6.93 8h-2.39c-.17-1.62-.74-3.12-1.6-4.39A8.03 8.03 0 0 1 18.93 10ZM12 4c1.53 1.84 2.5 4.44 2.69 6H9.31C9.5 8.44 10.47 5.84 12 4ZM6.53 14a13.7 13.7 0 0 1 0-4h2.94a14.9 14.9 0 0 0 0 4Zm.78 2h2.4c.18 1.62.75 3.12 1.6 4.39A8.03 8.03 0 0 1 7.31 16Zm2.4-8h-2.4a8.03 8.03 0 0 1 4-4.39c-.85 1.27-1.42 2.77-1.6 4.39Zm3.35 8h2.4a8.03 8.03 0 0 1-4 4.39c.85-1.27 1.42-2.77 1.6-4.39Zm.24-2a14.9 14.9 0 0 0 0-4h2.94a13.7 13.7 0 0 1 0 4Zm-5.64-8c-.86 1.27-1.43 2.77-1.6 4.39H5.07A8.03 8.03 0 0 1 7.31 6ZM12 20c-1.53-1.84-2.5-4.44-2.69-6h5.38C14.5 15.56 13.53 18.16 12 20Zm4.69-4c.86-1.27 1.43-2.77 1.6-4.39h2.39a8.03 8.03 0 0 1-4 4.39Z" />
    </svg>
  );
}

function PublisherAvatar({
  name,
  avatar,
}: {
  name: string;
  avatar: string | null;
}) {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("") || "TC";

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe8e2] text-xs font-semibold text-[#ff7d68]">
      {initials}
    </span>
  );
}

function RelatedToolCard({ tool, index }: { tool: HomePageTool; index: number }) {
  const imageSrc = tool.image ?? getFallbackImage(index);
  const primaryCategory = tool.categories[0]?.name ?? "Product";
  const createdAt = tool.createdAt ? new Date(tool.createdAt) : null;

  return (
    <Link
      href={`/sites/${tool.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#f0efef] bg-white shadow-[0_26px_50px_-40px_rgba(23,23,31,0.35)] transition hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={tool.name}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#1a1a1f] shadow-sm">
          {primaryCategory}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#a0a0a8]">
          <span>Featured</span>
          {createdAt ? (
            <time dateTime={createdAt.toISOString()}>
              {createdAt.toLocaleDateString()}
            </time>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold text-[#1f1f24]">{tool.name}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-[#5a5a63]">
          {tool.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 text-xs font-medium text-[#7f7f88]">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag.slug} className="rounded-full bg-[#f6f6f8] px-3 py-1">
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function SiteDetailPage({ params }: PageProps) {
  const site = await getSiteDetail(params.slug);

  if (!site) {
    notFound();
  }

  const primaryCategory = site.categories[0] ?? { name: "All", slug: slugify("All") };
  const published = formatDate(site.createdAt);
  const websiteHref = normalizeExternalUrl(site.link);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    primaryCategory?.slug
      ? {
          label: primaryCategory.name,
          href: `/category/${primaryCategory.slug}`,
        }
      : {
          label: primaryCategory.name,
          href: "/category",
        },
    { label: site.name, href: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[92rem] px-6 pb-24 pt-12 lg:px-12 xl:px-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#8b8b94]">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const content = crumb.href ? (
              <Link
                key={crumb.label}
                href={crumb.href}
                className="flex items-center gap-1 text-[#8b8b94] transition hover:text-[#ff7d68]"
              >
                {index === 0 ? <HomeIcon className="h-4 w-4" /> : null}
                <span>{crumb.label}</span>
              </Link>
            ) : (
              <span key={crumb.label} className="flex items-center gap-1 text-[#ff7d68]">
                {crumb.label}
              </span>
            );

            return (
              <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {content}
                {!isLast ? <ChevronRight className="h-4 w-4 text-[#d4d4da]" /> : null}
              </div>
            );
          })}
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex flex-col gap-8">
            <header className="space-y-5">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[#ff6d57]">
                  {site.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5a5a63]">
                  {site.description}
                </p>
              </div>
              {websiteHref ? (
                <Link
                  href={websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ff7d68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a43]"
                >
                  <IconifyGlobeIcon className="h-4 w-4" />
                  Visit Website
                </Link>
              ) : null}
            </header>

            <article className="rounded-[24px] border border-[#f0efef] bg-[#f6f6f8] p-8">
              <h2 className="text-lg font-semibold text-[#1f1f24]">Introduction</h2>
              <div className="mt-5">
                <MarkdownContent content={site.introductionMarkdown} className="space-y-4" />
              </div>
            </article>

            <BackButton className="mt-4 w-fit" />
          </section>

          <aside className="flex flex-col gap-8">
            {websiteHref ? (
              <Link
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group/preview relative block h-[220px] overflow-hidden rounded-[24px] border border-[#f0efef] bg-[#f6f6f8]"
              >
                <Image
                  src={site.image ?? getFallbackImage(site.id)}
                  alt={site.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover transition duration-500 group-hover/preview:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-[#0b1120]/0 transition duration-500 group-hover/preview:bg-[#0b1120]/45" />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold tracking-[0.3em] text-white opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100">
                  VIEW DETAIL
                </span>
              </Link>
            ) : (
              <div className="relative h-[220px] w-full overflow-hidden rounded-[24px] border border-[#f0efef] bg-[#f6f6f8]">
                <Image
                  src={site.image ?? getFallbackImage(site.id)}
                  alt={site.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="rounded-[24px] border border-[#f0efef] bg-[#f6f6f8] p-8">
              <h3 className="text-base font-semibold text-[#1f1f24]">Information</h3>
              <dl className="mt-5 space-y-4 text-sm text-[#5a5a63]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#8b8b94]">Publisher</dt>
                  <dd className="ml-auto flex items-center gap-3 text-right font-medium text-[#1f1f24]">
                    <PublisherAvatar name={site.publisherName} avatar={site.publisherAvatar} />
                    <span>{site.publisherName}</span>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#8b8b94]">Website</dt>
                  <dd className="text-right font-medium text-[#1f1f24]">
                    {websiteHref ? (
                      <Link
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-[#ff7d68]"
                      >
                        {site.websiteLabel}
                      </Link>
                    ) : (
                      site.websiteLabel
                    )}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#8b8b94]">Published date</dt>
                  <dd className="text-right font-medium text-[#1f1f24]">
                    {published ?? "TBC"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[24px] border border-[#f0efef] bg-[#f6f6f8] p-8">
              <h3 className="text-base font-semibold text-[#1f1f24]">Categories</h3>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#5a5a63]">
                {site.categories.length > 0 ? (
                  site.categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="group/link relative inline-flex items-center uppercase tracking-wide text-[#5a5a63] transition-colors hover:text-[#ff7d68] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-[#ff7d68] after:transition-transform after:duration-200 group-hover/link:after:origin-left group-hover/link:after:scale-x-100"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-[#8b8b94]">No categories</span>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#f0efef] bg-[#f6f6f8] p-8">
              <h3 className="text-base font-semibold text-[#1f1f24]">Tags</h3>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#5a5a63]">
                {site.tags.length > 0 ? (
                  site.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/tag/${tag.slug}`}
                      className="group/tag relative inline-flex items-center gap-1 uppercase tracking-wide text-[#5a5a63] transition-colors hover:text-[#ff7d68]"
                    >
                      <span className="text-[#ff7d68] transition-transform duration-200 group-hover/tag:scale-125">
                        #
                      </span>
                      <span>{tag.name}</span>
                      <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-right scale-x-0 bg-[#ff7d68] transition-transform duration-200 group-hover/tag:origin-left group-hover/tag:scale-x-100" />
                    </Link>
                  ))
                ) : (
                  <span className="text-[#8b8b94]">No tags added</span>
                )}
              </div>
            </div>
          </aside>
        </div>

        {site.related.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1f1f24]">More Products</h2>
              {primaryCategory?.slug ? (
                <Link
                  href={`/category/${primaryCategory.slug}`}
                  className="text-sm font-medium text-[#ff7d68] transition hover:text-[#ff5a43]"
                >
                  View All →
                </Link>
              ) : null}
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {site.related.map((relatedTool, index) => (
                <RelatedToolCard key={relatedTool.slug} tool={relatedTool} index={index} />
              ))}
            </div>
          </section>
        ) : null}

        <JoinTheCommunity className="mt-24" />
      </main>

      <SiteFooter showJoin={false} />
    </div>
  );
}
