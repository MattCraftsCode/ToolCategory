"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

type MultiSelectProps = {
  label?: string;
  placeholder?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
  searchPlaceholder?: string;
  selectAllLabel?: string;
  clearLabel?: string;
  borderClassName?: string;
};

export function MultiSelect({
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  className,
  searchPlaceholder = "Search...",
  selectAllLabel = "Select all",
  clearLabel = "Clear",
  borderClassName,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return options;
    return options.filter((option) => option.toLowerCase().includes(trimmed));
  }, [options, query]);

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
      return;
    }
    onChange(Array.from(new Set([...value, option])));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-2 text-sm font-medium text-[#1f1f24]",
        className,
      )}
    >
      {label ? <span>{label}</span> : null}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "h-12 w-full cursor-pointer rounded-[10px] border border-[#e0e0e6] bg-white px-4 text-left text-sm text-[#2d2d32] transition hover:border-[#ff7d68] focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15",
            borderClassName,
          )}
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
                placeholder={searchPlaceholder}
                className="w-full border-0 bg-transparent text-sm text-[#2d2d32] outline-none"
              />
            </div>

            <div className="mt-3 max-h-48 space-y-1 overflow-y-auto pr-1 text-sm text-[#2d2d32]">
              {filteredOptions.length === 0 ? (
                <p className="rounded-[10px] bg-[#f5f5f8] px-3 py-2 text-xs text-[#9a9aa3]">
                  No results found.
                </p>
              ) : (
                filteredOptions.map((option) => {
                  const selected = value.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleOption(option)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 text-left transition hover:bg-[#f8f8fb]"
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full border transition",
                          selected
                            ? "border-[#ff7d68] bg-[#ff7d68] text-white"
                            : "border-[#d7d7dd] text-transparent",
                        )}
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
                {selectAllLabel}
              </button>
              <button
                type="button"
                className="cursor-pointer text-[#ff7d68] transition hover:text-[#ff6b54]"
                onClick={() => onChange([])}
              >
                {clearLabel}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
