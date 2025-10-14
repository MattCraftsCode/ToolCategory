import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? normalized : "item";
}

export function normalizeExternalUrl(link: string | null | undefined): string | null {
  if (!link) {
    return null;
  }

  try {
    const parsed = new URL(link);
    return parsed.toString();
  } catch {
    try {
      return new URL(`https://${link}`).toString();
    } catch {
      return null;
    }
  }
}
