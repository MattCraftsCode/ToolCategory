"use client";

import { useCallback, useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "toolcategory:theme";

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "light" || value === "dark";

const applyTheme = (mode: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  const body = document.body;
  root.classList.toggle("dark", mode === "dark");
  if (body) {
    body.classList.toggle("dark", mode === "dark");
  }
};

type FooterThemeToggleProps = {
  className?: string;
  variant?: "chip" | "icon";
};

export function FooterThemeToggle({ className, variant = "chip" }: FooterThemeToggleProps) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = isThemeMode(stored) ? stored : prefersDark ? "dark" : "light";

    setMode(initial);
    applyTheme(initial);
    setHydrated(true);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      applyTheme(next);
      return next;
    });
  }, []);

  const Icon = mode === "dark" ? Sun : MoonStar;
  const label = hydrated
    ? mode === "dark"
      ? "Light Mode"
      : "Dark Mode"
    : "Theme";

  const ariaLabel = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const sharedClasses =
    "transition duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff7d68]/60 dark:focus-visible:ring-white/60";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleMode}
        aria-label={ariaLabel}
        title={label}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e4ea] bg-white/80 text-[#4c4c54] hover:border-[#ff7d68] hover:text-[#ff7d68] dark:border-white/25 dark:bg-white/10 dark:text-white/80",
          sharedClasses,
          className
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="sr-only">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-3 rounded-full border border-[#e4e4ea] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#4c4c54] hover:border-[#ff7d68] hover:text-[#ff7d68] dark:border-white/20 dark:bg-white/10 dark:text-white/75 dark:hover:border-white/40",
        sharedClasses,
        className
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff7d68]/10 text-[#ff7d68] dark:bg-white/15 dark:text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </button>
  );
}
