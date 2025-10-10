"use client";

import { ArrowUp, ChevronDown, Image, Search, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MarkdownEditor } from "@/components/markdown-editor";
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
          <header className="space-y-3">
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
              <div className="hidden items-center gap-2 rounded-full border border-[#e2e2e8] px-3 py-1 text-xs font-semibold text-[#6a6a74] sm:flex">
                <span className="rounded-full bg-[#ffede7] px-2 py-0.5 text-[#ff7d68]">1 / 3</span>
                <span>Enter product details</span>
              </div>
            </div>

            <nav className="flex flex-1 flex-wrap items-center justify-center gap-12 text-sm font-semibold text-[#8c8c96]">
              {[
                { step: 1, label: "Details" },
                { step: 2, label: "Payment" },
                { step: 3, label: "Publish" },
              ].map(({ step, label }, index, arr) => (
                <div key={label} className="flex items-center gap-6">
                  <button
                    type="button"
                    className={`group flex cursor-pointer flex-col items-center gap-3 transition ${
                      step === 1 ? "text-[#1f1f24]" : "text-[#a6a6ae]"
                    }`}
                  >
                    <span
                      className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                        step === 1 ? "bg-[#ff7d68] text-white" : "bg-[#f2f2f6] text-[#8a8a92]"
                      }`}
                    >
                      {step}
                    </span>
                    <span>{label}</span>
                  </button>
                  {index < arr.length - 1 ? (
                    <span className="block h-px w-32 bg-[#f1f1f4]" aria-hidden />
                  ) : null}
                </div>
              ))}
            </nav>
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
              />
              <MultiSelect
                label="Tags"
                placeholder="Select tags"
                options={tagOptions}
                value={selectedTags}
                onChange={setSelectedTags}
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
                <Image className="h-7 w-7 text-[#c4c4cc]" />
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

function MultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase())
  );

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange(Array.from(new Set([...value, option])));
    }
  };

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", listener);
    return () => window.removeEventListener("mousedown", listener);
  }, []);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", listener);
    return () => window.removeEventListener("mousedown", listener);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-2 text-sm font-medium text-[#1f1f24]">
      <span>{label}</span>
      <div className="relative">
        <button
          type="button"
          className="h-12 w-full cursor-pointer rounded-[10px] border border-[#e0e0e6] bg-white px-4 text-left text-sm text-[#2d2d32] transition hover:border-[#ff7d68] focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[#2d2d32]">
              {value.length > 0 ? value.join(", ") : placeholder}
            </span>
            <ChevronDown className="h-5 w-5 text-[#b3b3ba]" />
          </div>
        </button>
        {open ? (
          <div className="absolute z-30 mt-2 w-full rounded-[12px] border border-[#ececf2] bg-white p-3 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.18)]">
            <div className="flex items-center gap-2 rounded-[8px] border border-[#e9e9ed] bg-[#f9f9fb] px-3 py-2 text-xs text-[#7a7a87]">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="w-full border-0 bg-transparent text-sm text-[#2d2d32] outline-none"
              />
            </div>
            <div className="mt-3 max-h-48 space-y-1 overflow-y-auto pr-1 text-sm text-[#2d2d32]">
              {filtered.length === 0 ? (
                <p className="rounded-[10px] bg-[#f5f5f8] px-3 py-2 text-xs text-[#9a9aa3]">
                  No results found.
                </p>
              ) : (
                filtered.map((option) => {
                  const selected = value.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 text-left transition hover:bg-[#f8f8fb]"
                      onClick={() => toggleOption(option)}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                          selected
                            ? "border-[#ff7d68] bg-[#ff7d68] text-white"
                            : "border-[#d7d7dd] text-transparent"
                        }`}
                      >
                        ●
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#f2f2f4] pt-3 text-xs text-[#8a8a94]">
              <button
                type="button"
                className="cursor-pointer text-[#ff7d68] transition hover:text-[#ff6b54]"
                onClick={() => onChange(Array.from(new Set(options)))}
              >
                Select all
              </button>
              <button
                type="button"
                className="cursor-pointer text-[#ff7d68] transition hover:text-[#ff6b54]"
                onClick={() => onChange([])}
              >
                Clear
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
