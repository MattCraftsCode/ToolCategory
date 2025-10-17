"use client";

import { ArrowRight, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlanFeature = {
  text: string;
  available: boolean;
};

export type PlanDefinition = {
  name: string;
  accent: string;
  chip?: { label: string; className: string; leading?: string };
  price: string;
  oldPrice?: string;
  features: PlanFeature[];
  popular?: boolean;
  buttonClass: string;
  wrapperClass?: string;
};

const DEFAULT_PLANS: PlanDefinition[] = [
  {
    name: "Free",
    accent: "text-[#1f1f24]",
    chip: { label: "Limited Time Only", className: "bg-[#feefe4] text-[#f98652]", leading: "⏰" },
    price: "$0",
    features: [
      { text: "Get 3 dofollow links to boost your SEO", available: true },
      {
        text: "Badge verification required & must be kept permanently - we check regularly & unpublish if removed",
        available: false,
      },
      { text: "Reviewed and listed within 4 weeks", available: false },
      { text: "No featured listing", available: false },
      { text: "Normal display style", available: false },
      { text: "No customer support", available: false },
    ],
    buttonClass:
      "mt-8 w-full justify-center rounded-full border border-[#efe1d8] bg-white px-6 py-3 text-sm font-semibold text-[#38383f] shadow-[0_18px_40px_-32px_rgba(38,38,45,0.35)] transition hover:bg-[#fff6f1] hover:text-[#38383f]",
  },
  {
    name: "Basic",
    accent: "text-[#ff654f]",
    chip: { label: "One Time", className: "bg-[#e7f9ef] text-[#32b872]" },
    price: "$2.9",
    oldPrice: "$9.9",
    features: [
      { text: "Get 3 dofollow links to boost your SEO", available: true },
      {
        text: "Badge completely optional - add for promotion or remove anytime without restrictions",
        available: true,
      },
      { text: "List right now, publish whenever you want", available: true },
      { text: "No featured listing", available: false },
      { text: "Normal display style", available: false },
      { text: "No customer support", available: false },
    ],
    popular: true,
    wrapperClass:
      "bg-gradient-to-b from-[#fff1ec] via-white to-white border border-[#ffc3b6] shadow-[0_45px_90px_-52px_rgba(255,109,84,0.55)]",
    buttonClass:
      "mt-8 w-full justify-center rounded-full bg-gradient-to-r from-[#ff7d68] via-[#ff6c58] to-[#ff5844] px-6 py-3 text-sm font-semibold text-white shadow-[0_26px_50px_-28px_rgba(255,110,84,0.75)] transition hover:bg-transparent hover:brightness-105 hover:text-white",
  },
  {
    name: "Pro",
    accent: "text-[#ff6b5a]",
    chip: { label: "One Time", className: "bg-[#e7f9ef] text-[#32b872]" },
    price: "$12.9",
    oldPrice: "$29.9",
    features: [
      { text: "Get >= 3 dofollow links to boost your SEO", available: true },
      {
        text: "Badge completely optional - add for promotion or remove anytime without restrictions",
        available: true,
      },
      { text: "List right now, publish whenever you want", available: true },
      { text: "Prominent featured spot at homepage", available: true },
      { text: "Special display style", available: true },
      { text: "Premium customer support", available: true },
    ],
    buttonClass:
      "mt-8 w-full justify-center rounded-full bg-gradient-to-r from-[#ff7d68] via-[#ff6c58] to-[#ff5844] px-6 py-3 text-sm font-semibold text-white shadow-[0_26px_50px_-28px_rgba(255,110,84,0.75)] transition hover:bg-transparent hover:brightness-105 hover:text-white",
  },
];

type PricingPlansProps = {
  plans?: PlanDefinition[];
  className?: string;
  buttonLabel?: string;
  onPlanSelect?: (plan: PlanDefinition) => void;
  processingPlanName?: string | null;
};

export function PricingPlans({
  plans = DEFAULT_PLANS,
  className,
  buttonLabel = "Go Submit",
  onPlanSelect,
  processingPlanName,
}: PricingPlansProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-3", className)}>
      {plans.map((plan) => (
        <div key={plan.name} className="relative flex">
          <div
            className={cn(
              "flex h-full w-full flex-col rounded-[26px] border border-[#f0f0f3] bg-white px-9 py-10 shadow-[0_32px_70px_-52px_rgba(37,37,45,0.35)]",
              plan.wrapperClass
            )}
          >
            {plan.popular ? (
              <span className="absolute top-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#ff6d57] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-[0_14px_30px_-12px_rgba(255,111,86,0.6)]">
                <span role="img" aria-hidden>
                  ⭐️
                </span>
                Popular
                <span role="img" aria-hidden>
                  ⭐️
                </span>
              </span>
            ) : null}

            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className={cn("text-sm font-semibold uppercase tracking-[0.32em]", plan.accent)}>
                  {plan.name}
                </p>
                {plan.chip ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                      plan.chip.className
                    )}
                  >
                    {plan.chip.leading ? <span>{plan.chip.leading}</span> : null}
                    {plan.chip.label}
                  </span>
                ) : null}
              </div>
              <div className="text-right">
                <p className="text-[2.8rem] font-semibold text-[#ff6d57]">{plan.price}</p>
                {plan.oldPrice ? (
                  <p className="text-sm font-medium text-[#c5c5cf] line-through">{plan.oldPrice}</p>
                ) : null}
              </div>
            </div>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full",
                      feature.available ? "bg-[#ffe1d9] text-[#ff7d68]" : "bg-transparent text-[#c3c3cc]"
                    )}
                  >
                    {feature.available ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                  <span className={cn(feature.available ? "text-[#42424a]" : "text-[#babbc3]")}>{feature.text}</span>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              className={plan.buttonClass}
              onClick={() => onPlanSelect?.(plan)}
              disabled={processingPlanName === plan.name}
            >
              {processingPlanName === plan.name
                ? "Redirecting…"
                : plan.name.toLowerCase() === "free"
                  ? "Go submit"
                  : "Select plan"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export const PRICING_PLANS = DEFAULT_PLANS;
