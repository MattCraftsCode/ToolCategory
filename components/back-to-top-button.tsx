"use client";

import { ArrowUp } from "lucide-react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

type BackToTopButtonProps = {
  className?: string;
};

export function BackToTopButton({ className }: BackToTopButtonProps) {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff7d68] text-white shadow-[0_20px_40px_-18px_rgba(255,125,104,0.7)] transition hover:bg-[#ff6b54]",
        className,
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
