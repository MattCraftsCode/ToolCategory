import { ShieldCheck } from "lucide-react";

import { PricingPlans } from "@/components/PricingPlans";
import { SumitSteps } from "@/components/SumitSteps";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubmissionPreview } from "@/components/SubmissionPreview";
import { BacklinkVerification } from "@/components/BacklinkVerification";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[92rem] flex-col px-6 pb-24 pt-16 lg:px-12 xl:px-20">
        <section className="space-y-12">
          <header className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ff6d57]">
                  Submission {uuid}
                </p>
                <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#17171c]">
                  Payment & confirmation
                </h1>
                <p className="max-w-2xl text-sm text-[#6a6a74]">
                  Secure your listing and unlock promotion perks across ToolCategory. Choose a plan,
                  confirm billing, and you&apos;ll be ready to publish in the final step.
                </p>
              </div>
              <div className="rounded-[16px] border border-[#f0d9d3] bg-white px-5 py-4 text-xs text-[#8a5d53]">
                <p className="font-semibold uppercase tracking-[0.18em] text-[#ff6d57]">
                  Need help?
                </p>
                <p className="mt-1 leading-relaxed">
                  Message us anytime in <span className="font-semibold">#payment-support</span> or
                  reply to your confirmation email.
                </p>
              </div>
            </div>
            <SumitSteps current="payment" />
          </header>

          <SubmissionPreview
            title="900.cool"
            description="900.cool 提供专业的静态网站托管平台，可快速部署 HTML、CSS 和 JavaScript 文件，并支持自定义域名。900.cool 提供专业的静态网站托管平台，可快速部署 HTML、CSS 和 JavaScript 文件，并支持自定义域名。"
            image="https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80"
            category="Static Hosting"
            tags={["#landing", "#website", "#deployment"]}
            plan="Free"
            status="Badge Verification Required"
            publishDate="Not published"
            createdDate="2025/10/11"
          />

          <section className="space-y-8 rounded-[18px] border border-[#e5e5ea] bg-white p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1f1f24]">Choose your plan</h2>
                <p className="text-sm text-[#8c8c96]">
                  Upgrade anytime or combine plans as your launch evolves.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#e2e2e8] px-3 py-1 text-xs font-semibold text-[#6a6a74]">
                <ShieldCheck className="h-4 w-4 text-[#ff7d68]" />
                Secure checkout powered by Lemon Squeezy
              </div>
            </div>

            <PricingPlans
              className="md:grid-cols-2 xl:grid-cols-3"
              buttonLabel="Select plan"
            />
          </section>

          <BacklinkVerification />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
