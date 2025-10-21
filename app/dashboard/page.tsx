import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DashboardSubmissionCard } from "@/components/dashboard-submission-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSitesForUserDashboard, getUserSitesCount } from "@/lib/data-loaders";
import { getSubmissionStatus } from "@/lib/submission-status";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
};

const ITEMS_PER_PAGE = 5;

const formatDateLabel = (date: Date | null, fallback: string) => {
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

type DashboardPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard")}`);
  }

  const userId = session.user.id;
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const [userRows, userSites, totalCount] = await Promise.all([
    db
      .select({ userType: users.userType })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1),
    getSitesForUserDashboard(userId, { page: currentPage, limit: ITEMS_PER_PAGE }),
    getUserSitesCount(userId),
  ]);

  const userTypeRaw = userRows[0]?.userType?.toLowerCase() ?? "free";
  const planLabel = PLAN_LABEL[userTypeRaw] ?? PLAN_LABEL.free;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const submissions = userSites.map((site) => {
    const categoryName = site.categories[0]?.name ?? "Uncategorized";
    const availableTags = site.tags.length > 0 ? site.tags : site.categories;
    const tagLabels = availableTags.length > 0
      ? availableTags.map((tag) => `#${tag.name}`)
      : ["#toolcategory"];

    const status = getSubmissionStatus({
      isPublished: Boolean(site.publishedAt),
      isVerified: site.isVerified,
      userType: userTypeRaw,
    });

    const primaryAction = (() => {
      if (site.publishedAt) {
        return { label: "Unpublish", disabled: false } as const;
      }

      const isPaidUser = userTypeRaw === "basic" || userTypeRaw === "pro";

      if (isPaidUser) {
        return { label: "In Review", disabled: true } as const;
      }

      if (site.isVerified) {
        return { label: "In Review", disabled: true } as const;
      }

      return { label: "Verify Badge & Submit", disabled: false } as const;
    })();

    return {
      key: site.uuid,
      siteUuid: site.uuid,
      preview: {
        title: site.name,
        description: site.description,
        image: site.image ?? FALLBACK_IMAGE,
        category: categoryName,
        tags: tagLabels,
        plan: planLabel,
        status: status.label,
        publishDate: formatDateLabel(site.publishedAt, "Not published"),
        createdDate: formatDateLabel(site.createdAt, "—"),
        statusColor: status.color,
        primaryActionLabel: primaryAction.label,
        primaryActionDisabled: primaryAction.disabled,
      },
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf5ff] to-white text-[#1f1f24]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[92rem] flex-col gap-10 px-6 pb-24 pt-16 lg:px-12 xl:px-20">
        <header className="space-y-3">
          <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#17171c]">Dashboard</h1>
          <p className="text-sm text-[#6a6a74]">Overview of submissions</p>
        </header>

        {submissions.length > 0 ? (
          <div className="space-y-8">
            {submissions.map((submission) => (
              <DashboardSubmissionCard key={submission.key} submission={submission} />
            ))}
          </div>
        ) : (
          <section className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-[#e5e5ec] bg-white/70 px-10 py-16 text-center">
            <p className="text-lg font-semibold text-[#1f1f24]">尚未提交任何网站</p>
            <p className="max-w-md text-sm leading-relaxed text-[#6a6a74]">
              提交第一个工具以在此查看状态、计划和审核进度。我们将会在这里展示所有与您相关的站点数据。
            </p>
          </section>
        )}

        {totalPages > 1 ? (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? `/dashboard?page=${currentPage - 1}` : "#"}
                  isDisabled={currentPage <= 1}
                />
              </PaginationItem>

              {/* First page */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink href="/dashboard?page=1">1</PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis before current page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard?page=${currentPage - 1}`}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink href={`/dashboard?page=${currentPage}`} isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {/* Next page */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard?page=${currentPage + 1}`}>
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis after current page */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink href={`/dashboard?page=${totalPages}`}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? `/dashboard?page=${currentPage + 1}` : "#"}
                  isDisabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
