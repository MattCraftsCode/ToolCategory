"use client";

import { useState } from "react";

import { ArrowDown, ArrowUp } from "lucide-react";

import { PricingPlans } from "@/components/PricingPlans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
  bullets?: string[];
};

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

        <section aria-label="Pricing plans">
          <PricingPlans />
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
