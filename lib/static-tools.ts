import { slugify } from "@/lib/utils";

export type RawShowcaseTool = {
  name: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
  addedAt: string;
};

export type ShowcaseTool = RawShowcaseTool & {
  slug: string;
  link: string | null;
};

const rawShowcaseTools: RawShowcaseTool[] = [
  {
    name: "Photo Enhancer",
    description:
      "Enhance your photos online for free. Increase image quality, sharpen details, and remove noise with one-click adjustments.",
    category: "Image",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Image", "AI Enhancer", "Creative Suite"],
    featured: true,
    addedAt: "2025-02-12T07:30:00.000Z",
  },
  {
    name: "Tool Journey",
    description:
      "Discover productivity-enhancing software and tools that accompany your workflow from ideation to launch.",
    category: "Productivity",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Productivity", "Management", "Marketing"],
    featured: true,
    addedAt: "2025-02-10T10:15:00.000Z",
  },
  {
    name: "UR Temp Mail",
    description:
      "Get free, instant temporary email addresses to protect your inbox and stay anonymous while testing new products.",
    category: "Security",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    tags: ["Privacy", "Utilities", "Daily Life"],
    addedAt: "2025-01-28T14:05:00.000Z",
  },
  {
    name: "BacklinkHelper",
    description:
      "Streamline backlink management with automated outreach, weekly reporting, and SEO insights tailored for marketers.",
    category: "Marketing",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    tags: ["Writing", "Marketing", "Management"],
    addedAt: "2025-01-22T09:45:00.000Z",
  },
  {
    name: "PromptMaster Studio",
    description:
      "Design reusable prompt templates, collaborate with your team, and deploy AI workflows across your favorite tools.",
    category: "AI",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tags: ["AI", "Writing", "Automation"],
    addedAt: "2025-01-18T08:12:00.000Z",
  },
  {
    name: "BudgetFlow",
    description:
      "Automate budgeting, forecasting, and reporting with dashboards that give finance teams real-time clarity.",
    category: "Finance",
    image:
      "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1200&q=80",
    tags: ["Finance", "Analytics", "Productivity"],
    addedAt: "2025-01-08T11:30:00.000Z",
  },
  {
    name: "PalettePilot",
    description:
      "Generate harmonious color palettes, preview them in UI mockups, and export tokens instantly to your design system.",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    tags: ["Design", "Branding", "Inspiration"],
    featured: true,
    addedAt: "2024-12-30T15:55:00.000Z",
  },
  {
    name: "VoxNote",
    description:
      "Turn voice notes into organized documents with automatic summaries, topic tags, and collaboration-ready exports.",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Audio", "Transcription", "Productivity"],
    addedAt: "2024-12-18T13:20:00.000Z",
  },
  {
    name: "AutomataHub",
    description:
      "Connect your SaaS stack, build no-code automations, and monitor performance with real-time alerts and analytics.",
    category: "Automation",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80",
    tags: ["Automation", "No Code", "Operations"],
    addedAt: "2024-12-05T17:10:00.000Z",
  },
];

export const showcaseTools: ShowcaseTool[] = rawShowcaseTools.map((tool) => {
  const slug = slugify(tool.name);
  return {
    ...tool,
    slug,
    link: `https://${slug}.toolcategory.com`,
  };
});

export const showcasesBySlug = new Map(showcaseTools.map((tool) => [tool.slug, tool] as const));

export type ShowcaseToolTag = {
  name: string;
  slug: string;
};

export function mapToolTags(tool: ShowcaseTool): ShowcaseToolTag[] {
  return tool.tags.map((tag) => ({ name: tag, slug: slugify(tag) }));
}
