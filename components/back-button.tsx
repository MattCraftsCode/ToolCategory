"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type BackButtonProps = {
  className?: string;
};

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e9e9ed] bg-white px-4 py-2 text-sm font-semibold text-[#5a5a63] transition hover:border-[#ff7d68] hover:text-[#ff7d68]",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
