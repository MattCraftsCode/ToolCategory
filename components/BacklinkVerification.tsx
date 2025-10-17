"use client";

import Image from "next/image";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";

import { Copy, Info, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { cn, normalizeExternalUrl } from "@/lib/utils";

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

type VerificationStatus = {
  type: "success" | "error";
  message: string;
  details?: string[];
};

type BacklinkVerificationProps = {
  defaultUrl?: string;
  highlight?: boolean;
  siteUuid: string;
  isVerified: boolean;
  onVerified?: () => void;
};

export const BacklinkVerification = forwardRef<HTMLElement, BacklinkVerificationProps>(
  function BacklinkVerification(
    {
      defaultUrl = "https://www.900.cool",
      highlight = false,
      siteUuid,
      isVerified,
      onVerified,
    },
    ref,
  ) {
    const [theme, setTheme] = useState<(typeof BADGE_OPTIONS)[number]["id"]>("light");
    const [websiteUrl, setWebsiteUrl] = useState(defaultUrl);
    const [isVerifying, setIsVerifying] = useState(false);
    const [status, setStatus] = useState<VerificationStatus | null>(null);
    const [localVerified, setLocalVerified] = useState(isVerified);

    useEffect(() => {
      setWebsiteUrl(defaultUrl);
    }, [defaultUrl]);

    useEffect(() => {
      setLocalVerified(isVerified);
    }, [isVerified]);

    const active = useMemo(
      () => BADGE_OPTIONS.find((option) => option.id === theme) ?? BADGE_OPTIONS[0],
      [theme],
    );

    const previewContainerClasses = cn(
      "flex h-32 items-center justify-center rounded-[18px] border border-dashed border-[#e0e1e9]",
      theme === "dark" ? "bg-[#0b0d12]" : "bg-[#fdf7f5]",
    );

    const badgeFrameClasses = cn(
      "rounded-[12px]",
      theme === "dark" ? "bg-[#0f1116]" : "bg-white",
    );

    const handleThemeChange = useCallback((nextTheme: (typeof BADGE_OPTIONS)[number]["id"]) => {
      setTheme(nextTheme);
    }, []);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(active.code);
        toast.success("Badge HTML copied to clipboard.");
      } catch (error) {
        console.error("[badge] copy failed", error);
        toast.error("Unable to copy the badge code. Please copy it manually.");
      }
    }, [active.code]);

    const handleVerify = useCallback(async () => {
      const trimmed = websiteUrl.trim();
      const messageTarget = (value: string) => {
        setStatus({ type: "error", message: value });
        toast.error(value);
      };

      if (localVerified) {
        const infoMessage = "This submission is already verified and awaiting review.";
        setStatus({ type: "success", message: infoMessage });
        return;
      }

      if (!siteUuid) {
        messageTarget("Missing submission identifier. Please refresh the page and try again.");
        return;
      }

      if (!trimmed) {
        messageTarget("Enter your website URL before verifying.");
        return;
      }

      const normalized = normalizeExternalUrl(trimmed) ?? trimmed;

      let targetUrl: string;
      try {
        const parsed = new URL(normalized);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("Invalid protocol");
        }
        targetUrl = parsed.toString();
      } catch {
        messageTarget("Enter a valid URL, for example https://example.com.");
        return;
      }

      setIsVerifying(true);
      setStatus(null);

      try {
        const response = await fetch("/api/badge-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl, badgeTheme: theme, siteUuid }),
        });

        const result = (await response.json().catch(() => null)) as
          | { success?: boolean; error?: string; errors?: string[]; verified?: boolean }
          | null;

        const errors = Array.isArray(result?.errors) ? result?.errors.filter(Boolean) : [];
        const errorMessage =
          errors[0] ?? result?.error ?? "We couldn’t verify your badge. Please try again.";

        if (!response.ok || !result?.success) {
          setStatus({ type: "error", message: errorMessage, details: errors.length > 1 ? errors : undefined });
          toast.error(errorMessage);
          return;
        }

        setStatus({ type: "success", message: "Badge verified successfully." });
        toast.success("Badge verified successfully.");
        setLocalVerified(true);
        onVerified?.();
      } catch (error) {
        console.error("[badge] verification failed", error);
        const fallback = "We couldn’t reach your website. Please try again in a moment.";
        setStatus({ type: "error", message: fallback });
        toast.error(fallback);
      } finally {
        setIsVerifying(false);
      }
    }, [localVerified, onVerified, siteUuid, theme, websiteUrl]);

    const isActionDisabled = localVerified || isVerifying;

    return (
      <section
        ref={ref}
        id="backlink-verification"
        tabIndex={-1}
        className={cn(
          "rounded-[26px] border border-[#edeef3] bg-white px-10 py-9 focus:outline-none",
          highlight && "ring-2 ring-[#ff7d68]/60 ring-offset-2 ring-offset-white",
        )}
        aria-label="Backlink badge verification"
      >
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
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 transition",
                      isActive ? "text-[#1f1f24]" : "text-[#b3b3bc]",
                    )}
                  >
                    <input
                      type="radio"
                      name="badge-theme"
                      value={option.id}
                      className="sr-only"
                      checked={isActive}
                      onChange={() => handleThemeChange(option.id)}
                    />
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full border",
                        isActive ? "border-[#f98984]" : "border-[#d7d7df]",
                      )}
                    >
                      <span
                        className={cn(
                          "size-3 rounded-full",
                          isActive ? "bg-[#ff6d57]" : "bg-white",
                        )}
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
                onClick={handleCopy}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e5e5ea] px-3 py-1 text-[11px] font-semibold text-[#5f5f68] transition hover:border-[#ff6d57] hover:text-[#ff6d57]"
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
              value={websiteUrl}
              onChange={(event) => {
                setWebsiteUrl(event.target.value);
                setStatus(null);
              }}
              placeholder="https://your-domain.com"
              className="h-12 w-full rounded-[16px] border border-[#e4e5ec] bg-[#f7f7fb] px-4 text-sm font-medium text-[#33333d] focus:border-[#ff6d57] focus:outline-none focus:ring-2 focus:ring-[#ff6d57]/20"
            />
          </div>

          {localVerified ? (
            <p className="text-sm font-medium text-[#4b5b7a]">
              Already verified — awaiting review before publishing.
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isActionDisabled}
            className={cn(
              "h-12 w-full rounded-[16px] text-sm font-semibold shadow-[0_24px_45px_-30px_rgba(255,109,87,0.65)] transition disabled:opacity-70",
              localVerified
                ? "cursor-not-allowed bg-[#e6e6ef] text-[#8a8aa1]"
                : "cursor-pointer bg-[#ff6d57] text-white hover:bg-[#ff5a43]",
              isVerifying && "cursor-not-allowed opacity-70"
            )}
          >
            {isVerifying ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify Badge"
            )}
          </button>

          {status ? (
            <div
              className={cn(
                "rounded-[18px] border px-5 py-4 text-sm",
                status.type === "success"
                  ? "border-[#cceede] bg-[#f3fff8] text-[#2e6a4a]"
                  : "border-[#ffd7d7] bg-[#fff2f2] text-[#8a3030]",
              )}
              role="status"
              aria-live="polite"
            >
              <p className="font-semibold">{status.message}</p>
              {status.details ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {status.details.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-start gap-3 rounded-[18px] border border-[#dce6ff] bg-[#f2f6ff] px-5 py-4 text-sm text-[#4b5b7a]">
            <span className="mt-0.5 text-[#4b5b7a]">
              <Info className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[#3f4d6c]">Badge Verification</p>
              <p className="text-sm text-[#5a6b8b]">
                Add the badge code to your website and click &quot;Verify Badge&quot; to verify. This is required
                for free plans and optional for paid plans.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
