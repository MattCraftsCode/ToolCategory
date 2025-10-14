import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

import { JoinTheCommunity } from "@/components/join-the-community";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteDetail } from "@/lib/data-loaders";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";

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

function getDisplayHost(link: string | null): { label: string; href: string | null } {
  if (!link) {
    return { label: "Not provided", href: null };
  }

  try {
    const url = new URL(link);
    const hostname = url.hostname.replace(/^www\./i, "");
    return { label: hostname, href: url.toString() };
  } catch {
    try {
      const url = new URL(`https://${link}`);
      const hostname = url.hostname.replace(/^www\./i, "");
      return { label: hostname, href: url.toString() };
    } catch {
      return { label: link, href: null };
    }
  }
}

function getPublisherName(link: string | null): string {
  const { label } = getDisplayHost(link);
  if (label === "Not provided") {
    return "ToolCategory";
  }
  return label
    .split(".")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SiteDetailPage({ params }: PageProps) {
  const siteId = Number.parseInt(params.id, 10);

  if (!Number.isFinite(siteId) || siteId <= 0) {
    notFound();
  }

  const site = await getSiteDetail(siteId);

  if (!site) {
    notFound();
  }

  const primaryCategory = site.categories[0] ?? { name: "All", slug: "" };
  const published = formatDate(site.createdAt);
  const website = getDisplayHost(site.link);
  const publisher = getPublisherName(site.link);
  const previewImage = site.image ?? FALLBACK_IMAGE;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    primaryCategory.slug
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
              {website.href ? (
                <Link
                  href={website.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ff7d68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff5a43]"
                >
                  <span role="img" aria-label="globe">
                    🌐
                  </span>
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
          </section>

          <aside className="flex flex-col gap-8">
            <div className="overflow-hidden rounded-[24px] border border-[#f0efef] bg-[#f6f6f8]">
              <div className="relative h-[220px] w-full bg-[#f6f6f8]">
                <Image
                  src={previewImage}
                  alt={site.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#f0efef] bg-[#f6f6f8] p-8">
              <h3 className="text-base font-semibold text-[#1f1f24]">Information</h3>
              <dl className="mt-5 space-y-4 text-sm text-[#5a5a63]">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#8b8b94]">Publisher</dt>
                  <dd className="text-right font-medium text-[#1f1f24]">{publisher}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[#8b8b94]">Website</dt>
                  <dd className="text-right font-medium text-[#1f1f24]">
                    {website.href ? (
                      <Link
                        href={website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-[#ff7d68]"
                      >
                        {website.label}
                      </Link>
                    ) : (
                      website.label
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
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#616168]">
                {site.categories.length > 0 ? (
                  site.categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="rounded-full px-3 py-1 uppercase tracking-wide text-[#5a5a63] transition hover:text-[#ff7d68]"
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
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#616168]">
                {site.tags.length > 0 ? (
                  site.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/tag/${tag.slug}`}
                      className="rounded-full px-3 py-1 uppercase tracking-wide text-[#5a5a63] transition hover:text-[#ff7d68]"
                    >
                      #{tag.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-[#8b8b94]">No tags added</span>
                )}
              </div>
            </div>
          </aside>
        </div>

        <JoinTheCommunity className="mt-24" />
      </main>

      <SiteFooter showJoin={false} />
    </div>
  );
}
