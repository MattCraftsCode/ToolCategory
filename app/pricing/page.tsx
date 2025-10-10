"use client";

import { useState } from "react";

import { ArrowDown, ArrowRight, ArrowUp, Check, X } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlanFeature = {
  text: string;
  available: boolean;
};

type PlanDefinition = {
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

type FAQItem = {
  question: string;
  answer: string;
  bullets?: string[];
};

const pricingPlans: PlanDefinition[] = [
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

const faqs: FAQItem[] = [
  {
    question: "Is it free to submit my product?",
    answer:
      "Yes, submitting your product is completely free. You can list it without any upfront cost. Paid plans only apply if you want additional visibility and features.",
  },
  {
    question: "What are the benefits of the Basic plan?",
    answer: "The Basic plan includes:",
    bullets: [
      "Priority listing over free submissions",
      "Access to basic analytics (views & clicks)",
      "Ability to edit your product details anytime",
      "Support via email",
    ],
  },
  {
    question: "What are the benefits of the Pro plan?",
    answer: "The Pro plan offers everything in Basic, plus:",
    bullets: [
      "Featured placement on the homepage and category pages",
      "Advanced analytics (conversion tracking, referrals, demographics)",
      "Highlighted badge for better visibility",
      "Priority support with faster response time",
    ],
  },
  {
    question: "What are the differences between Free and Basic plans?",
    answer:
      "Free Plan: Only allows basic product submission with no extra visibility. Basic Plan: Provides better ranking, analytics, and more flexibility for editing and support.",
  },
  {
    question: "What are the differences between Basic and Pro plans?",
    answer:
      "Basic: Suitable for small projects looking for visibility and basic stats. Pro: Best for businesses seeking maximum exposure, premium placement, and detailed insights.",
  },
  {
    question: "How does the payment work for Basic and Pro plans?",
    answer:
      "Payments are subscription-based (monthly or yearly). Once you choose a plan, your subscription renews automatically unless canceled.",
  },
  {
    question: "What currencies do you accept for payment?",
    answer:
      "We accept most major currencies, including USD, EUR, and GBP. Local payment options may also be available depending on your region.",
  },
  {
    question: "Do I need to provide a backlink for my listing?",
    answer:
      "No, providing a backlink is optional. However, having a backlink can improve your product’s credibility and visibility.",
  },
  {
    question: "What happens if I remove the badge from my website?",
    answer:
      "If you remove the badge, you may lose eligibility for certain promotional benefits, such as highlighted placement or SEO boosts.",
  },
  {
    question: "Is Tool Fame the same as ToolFame?",
    answer:
      "Yes, “Tool Fame” and “ToolFame” refer to the same platform. Both names may appear in different contexts but they represent the same service.",
  },
];

export default function PricingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff8f5] to-white text-[#1f1f24]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1100px] flex-col px-6 pb-24 pt-24 text-[#1d1d22] lg:px-0">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[#ff6d57]">
            Pricing
          </span>
          <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#1f1f24]">
            Choose a pricing plan
          </h1>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="relative flex">
              <div
                className={cn(
                  "flex h-full w-full flex-col rounded-[26px] border border-[#f0f0f3] bg-white px-9 py-10 shadow-[0_32px_70px_-52px_rgba(37,37,45,0.35)]",
                  plan.wrapperClass
                )}
              >
                {plan.popular ? (
                  <span className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#ff6d57] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-[0_14px_30px_-12px_rgba(255,111,86,0.6)]">
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
                        {feature.available ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </span>
                      <span className={cn(feature.available ? "text-[#42424a]" : "text-[#babbc3]")}>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button type="button" className={plan.buttonClass}>
                  Go Submit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-[32px] border border-[#f0f0f3] bg-white px-8 py-12">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#ff6d57]">
              Frequently Asked Questions
            </p>
          </div>
          <div className="divide-y divide-[#f1f1f4]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full cursor-pointer items-center justify-between text-left text-base font-medium text-[#202025] transition hover:text-[#ff6d57] hover:underline"
                    aria-expanded={isOpen}
                  >
                    {faq.question}
                    <span className="text-[#9a9aa3]">
                      {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "mt-3 max-h-[480px] opacity-100" : "max-h-0 opacity-0"
                    )}
                    aria-hidden={!isOpen}
                  >
                    <div className="space-y-3 text-sm leading-relaxed text-[#6f6f78]">
                      <p>{faq.answer}</p>
                      {faq.bullets ? (
                        <ul className="list-disc space-y-2 pl-5">
                          {faq.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter />

      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff7d68] text-white shadow-[0_20px_40px_-18px_rgba(255,125,104,0.7)] transition hover:bg-[#ff6b54]"
      >
        <ArrowUp className="h-5 w-5" />
      </a>
    </div>
  );
}
