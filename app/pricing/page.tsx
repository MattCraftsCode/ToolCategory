import { Suspense } from "react";
import { ArrowUp } from "lucide-react";

import { PricingContent } from "@/components/PricingContent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff8f5] to-white text-[#1f1f24]">
      <SiteHeader />
      <Suspense fallback={
        <div className="mx-auto flex w-full max-w-[1100px] flex-col px-6 pb-24 pt-24 text-[#1d1d22] lg:px-0">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[#ff6d57]">
              Pricing
            </span>
            <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#1f1f24]">
              Choose a pricing plan
            </h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff7d68] border-t-transparent"></div>
          </div>
        </div>
      }>
        <PricingContent />
      </Suspense>
      <SiteFooter />
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff7d68] text-white shadow-[0_20px_40px_-18px_rgba(255,125,104,0.7)] transition hover:bg-[#ff6b54]"
      >
        <ArrowUp className="h-5 w-5" />
      </a>
    </div>
  );
}
