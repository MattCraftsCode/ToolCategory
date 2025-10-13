"use client";

import Link from "next/link";
import { Upload, LogOut, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/sign-in-dialog";

const navLinks = [
  { label: "Category", href: "/category" },
  { label: "Blog", href: "#" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Submit", href: "/submit" },
];

export function SiteHeader() {
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
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
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[#ff7d68]"
              >
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
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#ffe1d9] text-sm font-semibold text-[#a0523f] transition hover:bg-[#ffd4c9]"
                >
                  {getUserInitials(session.user?.name)}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 top-12 w-56 cursor-pointer rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-semibold">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {session.user?.email}
                      </p>
                    </div>
                    <hr className="my-2" />
                    <Link
                      href="/dashboard"
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/submit"
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Upload className="h-4 w-4" />
                      Submit
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setShowSignIn(true)}
                variant="outline"
                className="rounded-full border-[#ff7d68] text-[#ff7d68] hover:bg-[#fff5f3]"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </>
  );
}
