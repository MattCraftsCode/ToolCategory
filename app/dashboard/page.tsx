import { BadgeCheck, ShieldCheck, PencilLine } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SubmissionPreview } from "@/components/SubmissionPreview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const submissions = [
  {
    title: "900.cool",
    description:
      "900.cool 提供专业的静态网站托管平台，可快速部署 HTML、CSS 和 JavaScript 文件，并支持自定义域名。",
    image: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
    category: "Static Hosting",
    tags: ["#landing", "#website", "#deployment"],
    plan: "Free",
    status: "Badge Verification Required",
    publishDate: "Not published",
    createdDate: "2025/10/11",
  },
  {
    title: "Prompty",
    description: "Prompty 是一个智能写作助手，可以在数秒内生成高质量的营销和产品文案。",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    category: "AI Tools",
    tags: ["#writing", "#marketing", "#ai"],
    plan: "Basic",
    status: "Ready to publish",
    publishDate: "Scheduled",
    createdDate: "2025/09/02",
  },
  {
    title: "MetricFlow",
    description: "MetricFlow 帮助团队实时监控关键指标，并提供智能告警与自动化报表功能。",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    category: "Analytics",
    tags: ["#dashboard", "#insights", "#team"],
    plan: "Pro",
    status: "Published",
    publishDate: "2025/07/18",
    createdDate: "2025/07/12",
  },
];

const actions = [
  { label: "Verify Badge & Submit", icon: BadgeCheck },
  { label: "Manage Badge", icon: ShieldCheck },
  { label: "Edit", icon: PencilLine },
];

const totalPages = 5;
const currentPage = 1;

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf5ff] to-white text-[#1f1f24]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[92rem] flex-col gap-10 px-6 pb-24 pt-16 lg:px-12 xl:px-20">
        <header className="space-y-3">
          <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#17171c]">Dashboard</h1>
          <p className="text-sm text-[#6a6a74]">Overview of submissions</p>
        </header>

        <div className="space-y-8">
          {submissions.map((submission) => (
            <SubmissionPreview key={submission.title} {...submission} actions={actions} />
          ))}
        </div>

        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" isDisabled={currentPage === 1} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <PaginationItem key={page}>
                  <PaginationLink href="#" isActive={isActive}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext href="#" isDisabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>

      <SiteFooter />
    </div>
  );
}
