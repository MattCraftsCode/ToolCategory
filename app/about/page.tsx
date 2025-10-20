import Link from "next/link";
import { ArrowUpRight, Globe2, LineChart, Sparkles, Users } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const stats = [
  {
    label: "Makers showcased",
    value: "4,800+",
    description: "Indie founders, studios, and enterprises trusting ToolCategory to launch.",
    icon: Users,
  },
  {
    label: "Monthly reach",
    value: "1.2M",
    description: "Curated impressions across the marketplace, newsletter, and partner feeds.",
    icon: Globe2,
  },
  {
    label: "Conversion lift",
    value: "3.4×",
    description: "Average visibility boost for teams upgrading to featured placements.",
    icon: LineChart,
  },
];

const values = [
  {
    title: "Earned attention",
    description:
      "We surface products that solve real problems and give them the spotlight they deserve—without noise or pay-to-win tricks.",
  },
  {
    title: "Creator-first",
    description:
      "We build alongside makers, sharing feedback loops, product research, and data stories that help sharpen every launch.",
  },
  {
    title: "Curated discovery",
    description:
      "A dedicated editorial team reviews and tags every submission so the right audience finds the right tool at the right time.",
  },
];

const milestones = [
  {
    year: "2021",
    heading: "From spreadsheet to stage",
    body: "ToolCategory started as a community-driven Airtable sheet. Within six months, we evolved into a searchable directory with personalized digests.",
  },
  {
    year: "2022",
    heading: "Scaling discovery",
    body: "We introduced category playbooks, automated maker onboarding, and sponsorships to give creators new ways to stand out.",
  },
  {
    year: "2023",
    heading: "Going global",
    body: "Multilingual landing pages and region-aware curation unlocked 50 new markets and doubled maker success stories.",
  },
  {
    year: "Today",
    heading: "Beyond the launch",
    body: "We’re expanding into lifecycle analytics, audience partnerships, and white-glove promotion for the tools shaping tomorrow.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#fff7f3] via-white to-[#f8faff]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-24 px-6 pb-24 pt-24 lg:px-12 xl:px-20">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 px-10 py-16 shadow-[0_16px_40px_-20px_rgba(255,125,104,0.35)]">
          <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-[#ffb19f]/50 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-[#89c6ff]/40 blur-[140px]" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#ff7d68]">
                <Sparkles className="h-4 w-4" />
                Our Story
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-[#15151a] sm:text-[3rem]">
                We champion the builders creating tomorrow’s essential tools.
              </h1>
              <p className="text-lg leading-relaxed text-[#55555f]">
                ToolCategory is a curated launchpad for the world’s most ambitious product teams.
                We help makers cut through the noise, reach decision-makers faster, and understand
                the audiences that matter.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff7d68] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-15px_rgba(255,125,104,0.4)] transition hover:bg-[#ff6b54]"
                >
                  Share your product
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffd0c4] bg-white/70 px-6 py-3 text-sm font-semibold text-[#ff7d68] transition hover:border-[#ffb39e] hover:text-[#ff6b54]"
                >
                  Explore plans
                </Link>
              </div>
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-2xl border border-[#f3d5cc] bg-white/80 px-6 py-6 shadow-[0_12px_32px_-18px_rgba(23,23,28,0.25)] transition hover:-translate-y-1"
                >
                  <item.icon className="mb-4 h-6 w-6 text-[#ff7d68]" />
                  <p className="text-3xl font-semibold text-[#15151a]">{item.value}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-[#f28e79]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f5f68]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 rounded-[28px] border border-[#e8ecf5] bg-white/90 px-10 py-16 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.3)] lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold tracking-tight text-[#15151a]">
              The platform for purposeful discovery
            </h2>
            <p className="text-base leading-relaxed text-[#4d4d57]">
              ToolCategory connects buyers with the tools that fit their workflow. Our editorial
              team, data-informed recommendations, and partner ecosystem work together to highlight
              what’s truly useful—not just what’s loudest.
            </p>
            <p className="text-base leading-relaxed text-[#4d4d57]">
              Every listing is reviewed by a curator, tagged across multiple vectors, and matched to
              audience cohorts who genuinely benefit. From indie studios to Fortune 500 teams, we
              make evaluation faster and smarter.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-[#f1f1f5] bg-[#f9f9ff] px-6 py-6 text-[#2b2b31] shadow-[0_12px_28px_-16px_rgba(81,81,110,0.25)]"
              >
                <h3 className="text-lg font-semibold text-[#1f1f27]">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c5c66]">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-10 rounded-[32px] border border-[#f1e3ff] bg-gradient-to-br from-white via-[#fbf3ff] to-[#f5f8ff] px-10 py-16 shadow-[0_22px_50px_-30px_rgba(112,71,235,0.3)]">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f2e8ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#7047eb]">
              Momentum
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1f1f24]">
              Built with the community, evolving with the ecosystem
            </h2>
            <p className="text-base leading-relaxed text-[#4b4b55]">
              We grow through conversations with founders, creators, and operators. Here’s how that
              journey has unfolded so far.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="flex flex-col gap-3 rounded-2xl border border-[#eadcff] bg-white/70 px-6 py-6 text-[#1f1f24] shadow-[0_12px_28px_-18px_rgba(112,71,235,0.28)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#7047eb]">
                  {milestone.year}
                </span>
                <h3 className="text-xl font-semibold">{milestone.heading}</h3>
                <p className="text-sm leading-relaxed text-[#4f4f59]">{milestone.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-[#101827]/5 bg-[#101827] px-8 py-10 text-white shadow-[0_20px_48px_-28px_rgba(16,24,39,0.45)]">
            <h3 className="text-2xl font-semibold">Let’s build new launch stories together</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Join our community of makers, explore curated playlists, or partner with us to
              activate high-intent audiences. Your next launch deserves momentum.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#101827] transition hover:bg-white/90"
              >
                Submit your tool
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:hello@toolcategory.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
