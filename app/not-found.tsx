import Link from "next/link";

import { BackToTopButton } from "@/components/back-to-top-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff5f0] to-white text-[#1f1f1f]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col items-center justify-center px-6 pb-24 pt-20 text-center lg:px-12 xl:px-20">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#ffe0d6] bg-white text-3xl font-semibold text-[#ff7d68] shadow-[0_18px_45px_-30px_rgba(255,125,104,0.8)]">
          404
        </span>
        <h1 className="mt-6 text-[3rem] font-semibold tracking-tight text-[#17171c] md:text-[3.5rem]">
          Lost in the Toolverse?
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#6b6b72] md:text-lg">
          We couldn’t find the page you’re hunting for. It might have shipped off with another launch
          or never existed at all. Let’s get you back to the good stuff.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="h-12 rounded-full bg-[#ff7d68] px-8 text-sm font-semibold text-white shadow-[0_16px_40px_-28px_rgba(255,125,104,1)] transition hover:bg-[#ff6b54]">
            <Link href="/">Back to home</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-12 rounded-full border border-[#f0efef] px-8 text-sm font-semibold text-[#ff7d68] transition hover:border-[#ff7d68]/60 hover:bg-[#fff4f1]"
          >
            <Link href="/category">Browse categories</Link>
          </Button>
        </div>

        <div className="mt-14 w-full max-w-4xl rounded-[26px] border border-[#f0efef] bg-white px-8 py-10 text-left">
          <h2 className="text-lg font-semibold text-[#17171c]">Need to submit a tool instead?</h2>
          <p className="mt-2 text-sm text-[#6f6f78]">
            Makers are always welcome. Share what you’re building and we’ll help the community discover it.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#ff7d68] transition hover:text-[#ff6b54]"
          >
            Submit your product →
          </Link>
        </div>
      </main>

      <SiteFooter />
      <BackToTopButton className="right-4" />
    </div>
  );
}
