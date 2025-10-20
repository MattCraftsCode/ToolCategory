import { ShieldCheck, ShieldQuestion, ShieldAlert } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PrivacySection = {
  title: string;
  description: string;
  points?: string[];
};

const sections: PrivacySection[] = [
  {
    title: "What we collect",
    description:
      "We gather the information required to run a curated platform, improve recommendations, and honor your account preferences.",
    points: [
      "Account details that you share when signing up: email, name, and profile image.",
      "Submission data including tool descriptions, media assets, and category metadata.",
      "Usage analytics (page views, feature interactions) collected in aggregate for product insights.",
    ],
  },
  {
    title: "How we use data",
    description:
      "These signals help ToolCategory personalize discovery, keep the community safe, and deliver relevant communication.",
    points: [
      "Matching makers with high-intent audiences through curated newsletters and collections.",
      "Responding to support requests and product feedback with context.",
      "Maintaining platform security by monitoring for abuse, fraud, or suspicious activity.",
    ],
  },
  {
    title: "Your controls",
    description:
      "You retain control over how ToolCategory contacts you and what we keep. Reach out anytime for updates or removal.",
    points: [
      "Update account details directly from your dashboard or by emailing our team.",
      "Unsubscribe from marketing emails using the link in every message.",
      "Request data export or deletion at privacy@toolcategory.com. We respond within 30 days.",
    ],
  },
];

const dataProtectors = [
  {
    icon: ShieldCheck,
    title: "Security as a standard",
    copy: "Encryption in transit, scoped data access for staff, and routine security reviews keep your data guarded.",
  },
  {
    icon: ShieldAlert,
    title: "Transparency first",
    copy: "We notify affected accounts about meaningful changes to this policy or in the event of a security incident.",
  },
  {
    icon: ShieldQuestion,
    title: "We listen and adapt",
    copy: "The privacy landscape evolves quickly. We welcome questions and fold feedback directly into roadmap planning.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f8fbff] via-white to-[#fff9f4]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-20 px-6 pb-24 pt-24 lg:px-12 xl:px-20">
        <section className="relative overflow-hidden rounded-[28px] border border-[#dfe9ff] bg-white/90 px-10 py-16 shadow-[0_16px_42px_-24px_rgba(59,130,246,0.28)]">
          <div className="pointer-events-none absolute -top-28 right-16 h-60 w-60 rounded-full bg-[#cfe0ff] opacity-70 blur-[130px]" />
          <div className="relative max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3b82f6]">
              Privacy Policy
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#141821] sm:text-[3rem]">
              Your trust fuels the ToolCategory community.
            </h1>
            <p className="text-lg leading-relaxed text-[#4b5563]">
              We designed this privacy policy to keep things clear: what we collect, how we use it,
              and the choices available to you. We never sell personal data and only partner with
              vendors who meet our security standards.
            </p>
            <p className="text-sm text-[#64748b]">
              Last updated: March 4, 2024
            </p>
          </div>
        </section>

        <section className="grid gap-8 rounded-[28px] border border-[#e2e8f0] bg-white px-10 py-16 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.28)] lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-[#111827]">
              How ToolCategory handles your information
            </h2>
            <p className="text-base leading-relaxed text-[#4b5563]">
              We collect only the data required to deliver a curated marketplace, support your
              account, and improve product experiences. Below you’ll find a transparent breakdown
              with plain-language summaries.
            </p>
          </div>
          <div className="grid gap-5">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-3xl border border-[#e2e8f0] bg-[#f8fbff] px-7 py-7 text-[#0f172a]"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  {section.description}
                </p>
                {section.points ? (
                  <ul className="mt-4 space-y-2 text-sm text-[#334155]">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-[32px] border border-[#c7d2fe] bg-gradient-to-br from-[#eef2ff] via-white to-[#f5f9ff] px-10 py-16 shadow-[0_20px_50px_-30px_rgba(99,102,241,0.28)] sm:grid-cols-3">
          {dataProtectors.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 px-6 py-6 text-[#111827] shadow-[0_12px_26px_-16px_rgba(79,70,229,0.24)]"
            >
              <item.icon className="h-8 w-8 text-[#6366f1]" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#4b5563]">{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="space-y-10 rounded-[28px] border border-[#fee2e2] bg-[#fff8f7] px-10 py-16 shadow-[0_18px_40px_-24px_rgba(248,113,113,0.25)]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[#b91c1c]">
              Data retention & international transfers
            </h2>
            <p className="text-base leading-relaxed text-[#7f1d1d]">
              We retain personal data while your account stays active or as required to meet legal
              obligations. When data is no longer needed, it is securely deleted or anonymized.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[#7f1d1d]">
            ToolCategory operates globally and may process information on servers located in the EU
            or the United States. Cross-border transfers follow standard contractual clauses and
            regional compliance frameworks. If you are based in the EU, UK, or a jurisdiction with
            specific data rights, contact us at privacy@toolcategory.com to exercise access, update,
            or erasure requests.
          </p>
        </section>

        <section className="rounded-[28px] border border-[#d1fae5] bg-gradient-to-br from-[#ecfdf5] via-white to-[#f0fdfa] px-10 py-16 text-[#064e3b] shadow-[0_20px_44px_-26px_rgba(16,185,129,0.3)]">
          <h2 className="text-3xl font-semibold tracking-tight">We’re here to help</h2>
          <p className="mt-4 text-base leading-relaxed text-[#047857]">
            Have questions about privacy or want to report a security issue? Email
            privacy@toolcategory.com and our trust team will respond within two business days.
          </p>
          <p className="mt-6 text-sm text-[#059669]">
            For legal inquiries, write to ToolCategory Privacy, 2040 Market Street, Suite 410, San
            Francisco, CA 94114, USA.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
