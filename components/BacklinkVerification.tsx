"use client";

import Image from "next/image";
import { useState } from "react";

import { Copy, Info } from "lucide-react";

const BADGE_OPTIONS = [
  {
    id: "light",
    label: "Light Theme",
    badgeSrc: "/badge-light.svg",
    code: `<a href="https://toolcategory.com/item/900cool-www900cool" target="_blank" rel="noopener noreferrer">
  <img src="https://toolcategory.com/badge-light.svg" alt="Featured on ToolCategory.com" style="height: 54px; width: auto;" />
</a>`,
  },
  {
    id: "dark",
    label: "Dark Theme",
    badgeSrc: "/badge-dark.svg",
    code: `<a href="https://toolcategory.com/item/900cool-www900cool" target="_blank" rel="noopener noreferrer">
  <img src="https://toolcategory.com/badge-dark.svg" alt="Featured on ToolCategory.com" style="height: 54px; width: auto;" />
</a>`,
  },
] as const;

export function BacklinkVerification() {
  const [theme, setTheme] = useState<(typeof BADGE_OPTIONS)[number]["id"]>("light");
  const active = BADGE_OPTIONS.find((option) => option.id === theme) ?? BADGE_OPTIONS[0];

  const previewBaseClasses = "flex h-32 items-center justify-center rounded-[18px] border border-dashed border-[#e0e1e9]";
  const previewContainerClasses = `${previewBaseClasses} ${
    theme === "dark" ? "bg-[#0b0d12]" : "bg-[#fdf7f5]"
  }`;

  const badgeFrameClasses =
    theme === "dark"
      ? "rounded-[12px] bg-[#0f1116]"
      : "rounded-[12px] bg-white";

  return (
    <section className="rounded-[26px] border border-[#edeef3] bg-white px-10 py-9">
      <header className="mb-8 space-y-2">
        <h2 className="text-xl font-semibold text-[#1f1f24]">Backlink Badge Verification</h2>
        <p className="text-sm text-[#6a6a74]">
          Add the badge code below to your website. This is required for free plans and optional for
          paid plans.
        </p>
      </header>

      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#a3a3af]">
            Badge Theme
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#1f1f24]">
            {BADGE_OPTIONS.map((option) => {
              const isActive = option.id === theme;
              return (
                <label
                  key={option.id}
                  className={`inline-flex cursor-pointer items-center gap-2 transition ${
                    isActive ? "text-[#1f1f24]" : "text-[#b3b3bc]"
                  }`}
                >
                  <input
                    type="radio"
                    name="badge-theme"
                    value={option.id}
                    className="sr-only"
                    checked={isActive}
                    onChange={() => setTheme(option.id)}
                  />
                  <span
                    className={`grid size-5 place-items-center rounded-full border ${
                      isActive ? "border-[#f98984]" : "border-[#d7d7df]"
                    }`}
                  >
                    <span
                      className={`size-3 rounded-full ${
                        isActive ? "bg-[#ff6d57]" : "bg-white"
                      }`}
                    />
                  </span>
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#a3a3af]">
            Badge Preview
          </p>
          <div className={previewContainerClasses}>
            <Image
              src={active.badgeSrc}
              alt={`ToolCategory badge ${active.id}`}
              width={220}
              height={54}
              className={badgeFrameClasses}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.32em] text-[#a3a3af]">
            <span>Badge Code</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e5ea] px-3 py-1 text-[11px] font-semibold text-[#5f5f68] transition hover:border-[#ff6d57] hover:text-[#ff6d57]"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
          <textarea
            spellCheck={false}
            className="min-h-[110px] w-full resize-none rounded-[18px] border border-[#ececf1] bg-[#fbfbfd] px-4 py-3 font-mono text-xs leading-relaxed text-[#3a3a44]"
            value={active.code}
            readOnly
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#a3a3af]">
            Your Website URL
          </p>
          <input
            type="url"
            defaultValue="https://www.900.cool"
            className="h-12 w-full rounded-[16px] border border-[#e4e5ec] bg-[#f7f7fb] px-4 text-sm font-medium text-[#33333d]"
          />
        </div>

        <button
          type="button"
          className="h-12 w-full rounded-[16px] bg-[#ff6d57] text-sm font-semibold text-white shadow-[0_24px_45px_-30px_rgba(255,109,87,0.65)] transition hover:bg-[#ff5a43]"
        >
          Verify Badge
        </button>

        <div className="flex items-start gap-3 rounded-[18px] border border-[#dce6ff] bg-[#f2f6ff] px-5 py-4 text-sm text-[#4b5b7a]">
          <span className="mt-0.5 text-[#4b5b7a]">
            <Info className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-[#3f4d6c]">Badge Verification</p>
            <p className="text-sm text-[#5a6b8b]">
              Add the badge code to your website and click &quot;Verify Badge&quot; to verify. This is
              required for free plans and optional for paid plans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
