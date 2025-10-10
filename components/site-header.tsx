import Link from "next/link";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Category", href: "#" },
  { label: "Collection", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Pricing", href: "/pricing" },
  { label: "Submit", href: "/submit" },
];

export function SiteHeader() {
  return (
    <header
      id="top"
      className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-6 px-6 py-4 lg:px-12 xl:px-20">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7d68] text-sm font-semibold text-white shadow-[0_12px_40px_-18px_rgba(255,125,104,0.8)]">
            TC
          </span>
          <span className="text-lg font-semibold tracking-tight text-[#1f1f24]">
            ToolCategory
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#616168] md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-[#ff7d68]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden gap-2 rounded-full bg-[#ff7d68] px-5 text-sm font-semibold text-white shadow-[0_18px_45px_-22px_rgba(255,125,104,0.9)] transition hover:bg-[#ff6b54] md:inline-flex"
          >
            <Link href="/submit">
              <Upload className="h-4 w-4" />
              Submit
            </Link>
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe1d9] text-sm font-semibold text-[#a0523f]">
            YC
          </div>
        </div>
      </div>
    </header>
  );
}
