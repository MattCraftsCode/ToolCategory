import { Gavel, ScrollText } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type TermsSection = {
  title: string;
  summary: string;
  items?: string[];
};

const sections: TermsSection[] = [
  {
    title: "Acceptance of terms",
    summary:
      "By accessing or using ToolCategory, you agree to these terms and any policies referenced here. If you are using the platform on behalf of an organization, you confirm you have authority to bind that organization to these terms.",
  },
  {
    title: "Accounts & submissions",
    summary:
      "You are responsible for the accuracy of the information submitted, safeguarding your credentials, and ensuring that your content complies with applicable laws and does not infringe the rights of others.",
    items: [
      "Only submit tools you are authorized to represent, with truthful descriptions and media.",
      "Do not upload malicious code, spam, or misleading claims.",
      "Notify us immediately if you suspect unauthorized use of your account.",
    ],
  },
  {
    title: "Plans, billing & refunds",
    summary:
      "Paid plans enhance visibility and unlock premium features. Unless otherwise stated, subscriptions renew automatically until canceled. Refunds may be considered if a service failure is on ToolCategory.",
    items: [
      "You can cancel renewals at any time in your billing center or by contacting support.",
      "Promotional placements are scheduled in advance; missed deadlines caused by maker delays may forfeit slots without refund.",
      "Taxes may apply depending on your jurisdiction and are your responsibility when not collected by ToolCategory.",
    ],
  },
  {
    title: "Intellectual property",
    summary:
      "ToolCategory respects IP rights. All platform assets, logos, and curated collections are owned by ToolCategory. You retain rights to your own content but grant us a license to display and promote it across properties and partner feeds.",
  },
  {
    title: "Acceptable use",
    summary:
      "Keep the community constructive. You agree not to misuse the platform, scrape data, resell access, or engage in behavior that harms other members or the marketplace.",
    items: [
      "No automated scraping or rate-limiting attacks.",
      "No harassment, hate speech, or deceptive reviews.",
      "Respect confidentiality of beta features shared under NDA.",
    ],
  },
  {
    title: "Termination",
    summary:
      "We may suspend or terminate accounts that violate these terms. You may close your account at any time. Certain sections—like intellectual property, indemnity, and dispute resolution—survive termination.",
  },
  {
    title: "Dispute resolution",
    summary:
      "We aim to resolve issues quickly. Contact support first; if not resolved, disputes will be handled under the laws of the State of California, USA, with San Francisco County as the exclusive venue.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#fff8f2] via-white to-[#f1f5ff]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-20 px-6 pb-24 pt-24 lg:px-12 xl:px-20">
        <section className="relative overflow-hidden rounded-[28px] border border-[#fde6d8] bg-white/90 px-10 py-16 shadow-[0_16px_42px_-24px_rgba(250,119,99,0.28)]">
          <div className="pointer-events-none absolute -right-32 top-[-120px] h-72 w-72 rounded-full bg-[#ffe1d7] opacity-70 blur-[150px]" />
          <div className="relative max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3ec] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#f97316]">
              Terms of Use
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#1f1f24] sm:text-[3rem]">
              The guidelines that keep ToolCategory thriving.
            </h1>
            <p className="text-lg leading-relaxed text-[#4a5568]">
              These terms explain how our marketplace works, what you can expect from us, and what we
              expect from every creator, partner, and visitor. Please read them carefully.
            </p>
            <p className="text-sm text-[#64748b]">Last updated: March 4, 2024</p>
          </div>
        </section>

        <section className="grid gap-10 rounded-[28px] border border-[#e2e8f0] bg-white px-10 py-16 shadow-[0_18px_45px_-26px_rgba(30,64,175,0.28)] lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-[#1e293b]">
              Using ToolCategory responsibly
            </h2>
            <p className="text-base leading-relaxed text-[#475569]">
              ToolCategory is a curated catalogue and promotion engine for software makers. To keep
              it valuable for everyone, we ask you to follow the practices below. Most participants
              never run into an issue—we’re sharing these details to stay transparent.
            </p>
            <div className="rounded-[24px] border border-[#d9e2ff] bg-[#eff4ff] px-8 py-8 text-[#1e293b] shadow-[0_12px_32px_-18px_rgba(37,99,235,0.28)]">
              <Gavel className="mb-4 h-7 w-7 text-[#2563eb]" />
              <p className="text-sm leading-relaxed text-[#374151]">
                Not sure whether an idea fits? Email legal@toolcategory.com before launching a
                campaign or uploading assets. We’ll help align your plan to community guidelines.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] px-7 py-7 text-[#0f172a]"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">{section.summary}</p>
                {section.items ? (
                  <ul className="mt-4 space-y-2 text-sm text-[#334155]">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 rounded-[28px] border border-[#dbeafe] bg-gradient-to-br from-[#eff6ff] via-white to-[#f8fafc] px-10 py-16 shadow-[0_20px_48px_-28px_rgba(37,99,235,0.3)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-[#1e293b]">
                Additional legal terms
              </h2>
              <p className="text-sm leading-relaxed text-[#475569]">
                These clauses ensure the platform operates smoothly across jurisdictions.
              </p>
            </div>
            <ScrollText className="h-10 w-10 text-[#2563eb]" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#bfdbfe] bg-white/90 px-6 py-6 text-[#1e293b] shadow-[0_12px_28px_-18px_rgba(29,78,216,0.26)]">
              <h3 className="text-lg font-semibold">Limitation of liability</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                ToolCategory is provided “as is.” We are not liable for indirect damages, lost
                profits, or consequential losses arising from site usage.
              </p>
            </div>
            <div className="rounded-3xl border border-[#bbf7d0] bg-white/90 px-6 py-6 text-[#14532d] shadow-[0_12px_28px_-18px_rgba(16,185,129,0.26)]">
              <h3 className="text-lg font-semibold">Indemnification</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#166534]">
                You agree to indemnify ToolCategory against claims related to your submissions, use
                of the platform, or breach of these terms.
              </p>
            </div>
            <div className="rounded-3xl border border-[#fed7aa] bg-white/90 px-6 py-6 text-[#9a3412] shadow-[0_12px_28px_-18px_rgba(244,124,53,0.26)]">
              <h3 className="text-lg font-semibold">Policy updates</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#9a3412]">
                We may update these terms to reflect changes in law or new features. Significant
                updates will be announced via email or product banners.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#1e293b]">
            Questions or concerns? Email legal@toolcategory.com. We typically respond within two
            business days.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
