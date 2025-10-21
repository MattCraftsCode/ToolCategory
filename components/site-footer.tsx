import Link from "next/link";

import { ExternalLink, Github, Mail, Twitter } from "lucide-react";

import { JoinTheCommunity } from "@/components/join-the-community";
import { getFriendLinks } from "@/lib/data-loaders";

type SiteFooterProps = {
  showJoin?: boolean;
};

const CONTACT_TWITTER_URL = process.env.NEXT_PUBLIC_CONTACT_TWITTER_URL ?? "";
const CONTACT_GITHUB_URL = process.env.NEXT_PUBLIC_CONTACT_GITHUB_URL ?? "";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
const CONTACT_EMAIL_URL = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "";

const contactLinks = [
  { label: "Twitter", href: CONTACT_TWITTER_URL },
  { label: "Github", href: CONTACT_GITHUB_URL },
  { label: "Email", href: CONTACT_EMAIL_URL },
].filter((entry) => entry.href);

const footerNav = [
  {
    heading: "Product",
    links: [
      { label: "Submit", href: "/submit" },
      { label: "Pricing", href: "/pricing" },
      { label: "Category", href: "/category" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Tag", href: "/tag" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Contact",
    links: contactLinks,
  },
  {
    heading: "More",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

const footerQuickLinks = [
  "Video Tools",
  "Audio Tools",
  "Image Tools",
  "Animation Tools",
  "3D Tools",
  "Writing Tools",
  "Data Analysis Tools",
  "Social Media Tools",
  "Productivity Tools",
  "Development Tools",
  "Design Tools",
  "Chatbot Tools",
  "Daily Life Tools",
  "Legal Tools",
  "Finance Tools",
  "Marketing Tools",
  "Health Tools",
  "Research Tools",
  "Education Tools",
  "Translation Tools",
  "Management Tools",
  "Inspiration Tools",
];

export async function SiteFooter({ showJoin = true }: SiteFooterProps) {
  const friendLinks = await getFriendLinks();
  const hasCodeSnippets = friendLinks.codeSnippets.length > 0;
  const hasTextLinks = friendLinks.textLinks.length > 0;

  return (
    <div className="w-full">
      {showJoin ? <JoinTheCommunity className="mt-24" /> : null}

      <section className="mt-24 border-t border-[#efeff4] pt-16">
        <div className="mx-auto grid max-w-[92rem] gap-12 px-6 lg:grid-cols-[360px_1fr] lg:px-12 xl:px-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff7d68] text-sm font-semibold text-white">
                TC
              </span>
              <div>
                <p className="text-lg font-semibold text-[#1f1f24]">
                  ToolCategory
                </p>
                <p className="text-sm text-[#6f7075]">
                  ToolCategory.com &mdash; Explore, Choose, and Get Things Done.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#4c4c54]">
              {CONTACT_GITHUB_URL ? (
                <Link
                  href={CONTACT_GITHUB_URL}
                  aria-label="GitHub"
                  className="transition hover:text-[#ff7d68]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-5 w-5" />
                </Link>
              ) : null}
              {CONTACT_TWITTER_URL ? (
                <Link
                  href={CONTACT_TWITTER_URL}
                  aria-label="Twitter"
                  className="transition hover:text-[#ff7d68]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              ) : null}
              {CONTACT_EMAIL_URL ? (
                <Link
                  href={CONTACT_EMAIL_URL}
                  aria-label="Email"
                  className="transition hover:text-[#ff7d68]"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              ) : null}
            </div>
            <p className="text-sm text-[#6f7075]">
              Made with <span className="text-[#ff5b6a]">♥</span> by
              <span className="pl-1 font-medium text-[#9b5be1]">Matt</span>
            </p>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav
              .filter((column) => column.links.length > 0)
              .map((column) => (
                <div key={column.heading} className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1f1f24]">
                    {column.heading}
                  </p>
                  <ul className="space-y-2 text-sm text-[#6f7075]">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="cursor-pointer transition hover:text-[#ff7d68]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[92rem] border-t border-[#efeff4] px-6 pt-12 lg:px-12 xl:px-20">
          <h3 className="text-lg font-semibold text-[#1f1f24]">
            Quick Links &mdash; Explore more trending tools &amp; products
          </h3>
          <div className="mt-6 grid gap-y-4 gap-x-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {footerQuickLinks.map((link) => (
              <p
                key={link}
                className="cursor-pointer text-sm text-[#6f7075] transition hover:text-[#ff7d68]"
              >
                {link}
              </p>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-20 w-full">
        {hasCodeSnippets || hasTextLinks ? (
          <div className="mx-auto w-full max-w-[92rem] space-y-10 px-6 lg:px-12 xl:px-20">
            {hasCodeSnippets ? (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-[#1f1f24]">Friend Links</h3>
                <div className="marquee-container">
                  <div className="marquee-track items-center gap-4">
                    {/* First set */}
                    {friendLinks.codeSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="friend-link-snippet flex-shrink-0 px-1"
                      >
                        <div dangerouslySetInnerHTML={{ __html: snippet.code }} />
                      </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {friendLinks.codeSnippets.map((snippet) => (
                      <div
                        key={`duplicate-${snippet.id}`}
                        className="friend-link-snippet flex-shrink-0 px-1"
                        aria-hidden="true"
                      >
                        <div dangerouslySetInnerHTML={{ __html: snippet.code }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {hasTextLinks ? (
              <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#5a5a63]">
                {friendLinks.textLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="inline-flex items-center gap-1 transition hover:text-[#ff7d68]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mx-auto mt-10 flex w-full max-w-[92rem] flex-wrap items-center justify-between gap-4 border-t border-[#efeff4] px-6 pt-8 pb-8 text-sm text-[#6f7075] lg:px-12 xl:px-20">
          <p>Copyright © 2025 All Rights Reserved.</p>
          <span className="text-[#4c4c54]">ToolCategory.com</span>
        </div>
      </footer>
    </div>
  );
}
