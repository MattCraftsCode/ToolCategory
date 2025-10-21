import { ArrowUp } from "lucide-react";

import { PricingContent } from "@/components/PricingContent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff8f5] to-white text-[#1f1f24]">
      <SiteHeader />
      <PricingContent />
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
