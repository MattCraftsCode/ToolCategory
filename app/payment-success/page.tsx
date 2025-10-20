"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CheckCircle, Home, Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
  loading: () => null
});

const PLAN_LABELS = {
  basic: "Basic",
  pro: "Pro",
  free: "Free"
} as const;

const PLAN_PRICES = {
  basic: "$2.90",
  pro: "$12.90",
  free: "$0.00"
} as const;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Get plan from URL params
  const plan = searchParams.get("plan") as keyof typeof PLAN_LABELS || "basic";
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Set window dimensions for confetti
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Stop confetti after 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  const planLabel = PLAN_LABELS[plan];
  const planPrice = PLAN_PRICES[plan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff7f5] to-[#fff0ee] text-[#1f1f1f]">
      <SiteHeader />

      {/* Confetti Effect */}
      {showConfetti && windowDimensions.width > 0 && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#ff6d57', '#ff7d68', '#ffb4a8', '#ffd7d0', '#fff0ee']}
          gravity={0.1}
        />
      )}

      <main className="container mx-auto px-4 py-16">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-2xl text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-6 space-y-4">
              <h1 className="bg-gradient-to-r from-[#ff6d57] to-[#ff7d68] bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
                Payment Successful!
              </h1>
              <div className="flex items-center justify-center gap-2 text-2xl text-[#5a5a63]">
                <Sparkles className="h-6 w-6 text-[#ff7d68]" />
                <span>Welcome to ToolCategory {planLabel}</span>
                <Sparkles className="h-6 w-6 text-[#ff7d68]" />
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="mx-auto mb-8 max-w-md rounded-[24px] border border-[#f0efef] bg-white p-8 shadow-[0_26px_50px_-40px_rgba(23,23,31,0.35)]">
              <div className="space-y-4">
                <div className="text-lg font-semibold text-[#1f1f24]">Payment Details</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#5a5a63]">Plan</span>
                    <span className="font-semibold text-[#1f1f24]">{planLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5a5a63]">Amount</span>
                    <span className="font-semibold text-[#1f1f24]">{planPrice}</span>
                  </div>
                  {orderId && (
                    <div className="flex justify-between">
                      <span className="text-[#5a5a63]">Order ID</span>
                      <span className="font-mono text-xs text-[#7f7f88]">
                        {orderId.slice(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-12 rounded-[20px] bg-gradient-to-r from-[#f3fff8] to-[#f8fff3] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#2e6a4a]">
                🎉 What's Next?
              </h2>
              <div className="grid gap-3 text-left sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#4ade80]"></div>
                  <span className="text-sm text-[#2e6a4a]">
                    Your account has been upgraded to {planLabel}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#4ade80]"></div>
                  <span className="text-sm text-[#2e6a4a]">
                    Submit unlimited tools without restrictions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#4ade80]"></div>
                  <span className="text-sm text-[#2e6a4a]">
                    No backlink verification required
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#4ade80]"></div>
                  <span className="text-sm text-[#2e6a4a]">
                    Priority review and faster approval
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#ff6d57] px-8 py-4 text-lg font-semibold text-white shadow-[0_24px_45px_-30px_rgba(255,109,87,0.65)] transition hover:bg-[#ff5a43] hover:shadow-[0_30px_60px_-30px_rgba(255,109,87,0.8)]"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-[#e4e5ec] bg-white px-8 py-4 text-lg font-semibold text-[#1f1f24] transition hover:bg-[#f7f7fb] hover:border-[#ff6d57]"
              >
                <Sparkles className="h-5 w-5" />
                Submit Your Tool
              </Link>
            </div>

            {/* Footer Message */}
            <div className="mt-12 rounded-[16px] bg-[#f2f6ff] p-4 text-sm text-[#4b5b7a]">
              <p>
                🎯 Need help getting started? Check out our{" "}
                <Link href="/docs" className="font-semibold text-[#ff6d57] hover:underline">
                  documentation
                </Link>{" "}
                or{" "}
                <Link href="/contact" className="font-semibold text-[#ff6d57] hover:underline">
                  contact support
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}