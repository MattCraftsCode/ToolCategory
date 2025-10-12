"use client";

import { ArrowUp, Image, Wand2 } from "lucide-react";
import { useState } from "react";

import { SumitSteps } from "@/components/SumitSteps";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MultiSelect } from "@/components/multi-select";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { toolCategories } from "@/lib/site-data";

const tagOptions = [
  "AI",
  "Automation",
  "Productivity",
  "Design",
  "Marketing",
  "Analytics",
  "Research",
  "Beginner",
  "Browser Extension",
  "Mobile",
  "Free",
  "Paid",
];

export default function SubmitPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[92rem] flex-col px-6 pb-20 pt-14 lg:px-12 xl:px-20">
        <section className="space-y-12">
          <header className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[2.5rem] font-semibold tracking-tight text-[#17171c]">
                  Submit your product
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-[#6a6a74]">
                  Share your tool with the ToolCategory community. Provide clear details so we can
                  review, categorize, and feature your product in the best collections.
                </p>
              </div>
            </div>
            <SumitSteps current="details" />
          </header>

          <form className="space-y-10 rounded-[10px] border border-[#e5e5ea] bg-white p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-[#1f1f24]">
                Link
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Enter the link to your product"
                    className="h-12 w-full rounded-[10px] border border-[#e0e0e6] bg-white px-4 text-sm text-[#2d2d32] placeholder:text-[#b0b0b5] transition focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15"
                  />
                  <Button
                    type="button"
                    className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-[999px] bg-[#ff7d68] px-3 py-2 text-xs font-semibold text-white shadow-none transition hover:bg-[#ff6b54] sm:flex"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>AI Autofill</span>
                  </Button>
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#1f1f24]">
                Name
                <input
                  type="text"
                  placeholder="Enter the name of your product"
                  className="h-12 w-full rounded-[10px] border border-[#e0e0e6] bg-white px-4 text-sm text-[#2d2d32] placeholder:text-[#b0b0b5] transition focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15"
                />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <MultiSelect
                label="Categories"
                placeholder="Select categories"
                options={toolCategories}
                value={selectedCategories}
                onChange={setSelectedCategories}
                borderClassName="border-[#e0e0e6] hover:border-[#ff7d68] focus:border-[#ff7d68]"
              />
              <MultiSelect
                label="Tags"
                placeholder="Select tags"
                options={tagOptions}
                value={selectedTags}
                onChange={setSelectedTags}
                borderClassName="border-[#e0e0e6] hover:border-[#ff7d68] focus:border-[#ff7d68]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-[#1f1f24]">
                <span>Description</span>
                <span className="text-xs font-normal text-[#9a9aa3]">[Words: 0/80-160]</span>
              </div>
              <textarea
                placeholder="Enter a brief description of your product... For example: A powerful AI content generation tool that helps creators produce high-quality articles and marketing copy with advanced NLP capabilities"
                rows={3}
                className="min-h-[110px] w-full rounded-[10px] border border-[#e0e0e6] bg-white px-4 py-3 text-sm leading-relaxed text-[#2d2d32] placeholder:text-[#b0b0b5] transition focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-[#1f1f24]">
                <span>Introduction</span>
                <span className="text-xs font-normal text-[#9a9aa3]">
                  [Words: 0/1000-4000] (Markdown supported)
                </span>
              </div>
              <MarkdownEditor placeholder={"Enter your content here... For Example:\n• Overview\n• Key Features\n• Use Cases\n• Getting Started\n• Pricing & Plans"} />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-[#1f1f24]">
                <span>Image</span>
                <span className="text-xs font-normal text-[#9a9aa3]">(16:9, PNG or JPEG, max 1MB)</span>
              </div>
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-[#d7d7dd] text-sm text-[#858593] transition hover:bg-[#f7f7f9]">
                <Image alt="" className="h-7 w-7 text-[#c4c4cc]" />
                <span className="text-sm text-[#7a7a87]">Drag &amp; drop or select image to upload</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#f2f2f4] bg-[#fafafb] px-6 py-5 text-xs text-[#7c7c86]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Button className="cursor-pointer rounded-[12px] bg-[#ff7d68] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff6b54]">
                  Submit
                </Button>
                <p className="flex items-center gap-2 text-[#8a8a94]">
                  <span role="img" aria-label="smile">
                    🙂
                  </span>
                  No worries, you can change this information later.
                </p>
              </div>
            </div>
          </form>
        </section>
      </main>

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
