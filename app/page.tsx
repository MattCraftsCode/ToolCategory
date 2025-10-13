import Image from "next/image";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

import { BackToTopButton } from "@/components/back-to-top-button";
import { CategoryList } from "@/components/category-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategories } from "@/lib/data-loaders";

type Tool = {
  name: string;
  description: string;
  image: string;
  tags: string[];
  badge?: string;
  badgeClass?: string;
};

const imageGallery = [
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580894908171-dc2de66f2281?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512427691650-1e0c3d0adf80?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1458656310820-0ddae4b2588c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523294587484-bae6cc870010?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523473827534-86c21266fd79?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523966211575-eb4a15b148b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005198919-656e2be1a2b4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1473090928358-00f7d7489c1b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472489735873-b17ba174818f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=1200&q=80",
];

const buildTools = ({
  prefix,
  names,
  description,
  descriptions,
  tags,
  badge,
  badgeClass,
  imageOffset = 0,
}: {
  prefix: string;
  names?: string[];
  description: string;
  descriptions?: string[];
  tags: string[][];
  badge?: string;
  badgeClass?: string;
  imageOffset?: number;
}): Tool[] => {
  return Array.from({ length: 8 }, (_, index) => {
    const tagSet = tags[index % tags.length];
    const label = names?.[index % names.length] ?? `${prefix} ${index + 1}`;
    const detail = descriptions?.[index % descriptions.length] ?? description;

    return {
      name: label,
      description: detail,
      tags: tagSet,
      image: imageGallery[(imageOffset + index) % imageGallery.length],
      badge,
      badgeClass,
    };
  });
};

const featuredTools: Tool[] = [
  {
    name: "ToolZack",
    description:
      "Transform text instantly with advanced formatting presets and automation shortcuts.",
    tags: ["Featured", "Writing"],
    image: imageGallery[0],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "NuxtPro",
    description:
      "Launch SaaS products faster with pre-built auth, billing, and analytics dashboards.",
    tags: ["Featured", "Development"],
    image: imageGallery[1],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "SaaSFame",
    description:
      "Curated marketplace to discover, review, and showcase standout SaaS tools.",
    tags: ["Featured", "Marketing"],
    image: imageGallery[2],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "GEOly.net",
    description:
      "Research hub for generative search optimization with workflow templates and reports.",
    tags: ["Featured", "Data Analysis"],
    image: imageGallery[3],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "FlowBoard",
    description:
      "Visual planning board that syncs tasks, notes, and team milestones in real time.",
    tags: ["Featured", "Collaboration"],
    image: imageGallery[4],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "PixelForge Studio",
    description:
      "Design system manager with AI-assisted brand kits and export-ready assets.",
    tags: ["Featured", "Design"],
    image: imageGallery[5],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "Voxia Studio",
    description:
      "AI-assisted podcast editor with auto-leveling, transcription, and noise cleanup.",
    tags: ["Featured", "Audio"],
    image: imageGallery[6],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
  {
    name: "ChronoPlan",
    description:
      "Scheduling copilot that balances workloads with predictive forecasting insights.",
    tags: ["Featured", "Productivity"],
    image: imageGallery[7],
    badge: "Featured",
    badgeClass: "bg-[#ff7d68]",
  },
];

const latestTools = buildTools({
  prefix: "",
  names: [
    "WorkflowPilot",
    "SparkSuite",
    "NovaMetric",
    "TaskSprint",
    "SlateFlow",
    "TimelyOps",
    "OrbitDesk",
    "DailyDash",
  ],
  description: "Freshly launched platform that keeps your team moving forward.",
  descriptions: [
    "Fresh automation assistant that turns recurring workflows into guided playbooks.",
    "All-in-one hub for crafting launch campaigns and syncing assets across teams.",
    "Realtime analytics snapshots with anomaly alerts and executive summaries.",
    "Sprint planner that keeps agile rituals, documents, and goals perfectly aligned.",
    "Canvas for product specs with live stakeholder feedback and version control.",
    "Operations dashboard centralizing scheduling, approvals, and escalations.",
    "Shared workspace blending team chat, documents, and async decisions.",
    "Personal console surfacing highlights from tasks, briefs, and metrics.",
  ],
  tags: [
    ["Automation", "Productivity"],
    ["Launch", "Collaboration"],
    ["Analytics", "Dashboard"],
    ["Project", "Agile"],
    ["Design", "Specs"],
    ["Operations", "Calendar"],
    ["AI", "Workspace"],
    ["Focus", "Insights"],
  ],
  badge: "New",
  badgeClass: "bg-[#6366f1]",
  imageOffset: 8,
});

const videoTools = buildTools({
  prefix: "ClipForge",
  names: [
    "ClipForge",
    "MotionCraft",
    "SceneFlow",
    "ReelSpark",
    "StoryGrid",
    "FramePilot",
    "EditWave",
    "Lightcut",
  ],
  description: "Video tooling crafted for editors who need speed and precision.",
  descriptions: [
    "Collaborative editor with timeline comments and AI-powered rough cut suggestions.",
    "Template-driven motion graphics engine with reusable brand presets.",
    "Cloud dailies viewer supporting frame-accurate review and approvals.",
    "Promo generator that assembles social-ready clips from long-form footage.",
    "Narrative planner blending scripts, shot lists, and call sheets in one place.",
    "Camera ingest tool with automatic scene detection and color normalization.",
    "Audio-aware video trimmer that syncs beats and removes silences instantly.",
    "Lighting lookbook that tests grading profiles across footage versions.",
  ],
  tags: [
    ["Video", "Editing"],
    ["Motion", "Templates"],
    ["Review", "Collaboration"],
    ["Marketing", "Video"],
    ["Story", "Planning"],
    ["Production", "Color"],
    ["Audio", "Sync"],
    ["Lighting", "Grading"],
  ],
  badge: "Video",
  badgeClass: "bg-[#f97316]",
  imageOffset: 16,
});

const audioTools = buildTools({
  prefix: "SoundMint",
  names: [
    "SoundMint",
    "WaveLoop",
    "EchoLab",
    "TuneForge",
    "Beatline",
    "StudioMix",
    "RhythmIQ",
    "VoiceDeck",
  ],
  description: "Audio workflow assistants engineered for creators and engineers.",
  descriptions: [
    "Stem splitter with cloud project sync and collaborative mix notes.",
    "Loop library that recommends motifs based on BPM, key, and mood.",
    "Spatial audio designer with live preview for AR and VR scenes.",
    "Podcast mastering chain with gentle compression and loudness targets.",
    "Beat sketchbook combining sample packs, MIDI editor, and groove templates.",
    "Remote studio that records multi-track sessions with latency compensation.",
    "AI percussion assistant generating fills and transitions on demand.",
    "Voiceover desk offering tone suggestions and pronunciation guides.",
  ],
  tags: [
    ["Audio", "Production"],
    ["Loops", "Library"],
    ["Spatial", "Design"],
    ["Podcast", "Mastering"],
    ["Beat", "Sequencer"],
    ["Recording", "Remote"],
    ["AI", "Rhythm"],
    ["Voice", "Coaching"],
  ],
  badge: "Audio",
  badgeClass: "bg-[#22c55e]",
  imageOffset: 24,
});

const imageTools = buildTools({
  prefix: "PixelPilot",
  names: [
    "PixelPilot",
    "Renderly",
    "FrameMint",
    "PaletteAI",
    "SnapSuite",
    "TextureLab",
    "CanvasCore",
    "VisualShift",
  ],
  description: "Image tooling that accelerates creative delivery across teams.",
  descriptions: [
    "Smart asset manager with auto-tagging, cropping presets, and approvals.",
    "Lighting-aware upscaler that preserves brand color palettes perfectly.",
    "Moodboard builder blending inspiration, annotations, and reusable swatches.",
    "AI colorist that drafts palette systems from plain language prompts.",
    "Photography curation deck with shareable storyboards and client feedback.",
    "Texture generator producing seamless surfaces for 2D and 3D workflows.",
    "Vector workspace merging handoff specs with interactive previews.",
    "Automated variant creator generating localized imagery instantly.",
  ],
  tags: [
    ["Image", "Library"],
    ["Upscale", "Quality"],
    ["Moodboard", "Inspiration"],
    ["AI", "Color"],
    ["Photo", "Review"],
    ["Texture", "Generator"],
    ["Vector", "Handoff"],
    ["Localization", "Variants"],
  ],
  badge: "Image",
  badgeClass: "bg-[#0ea5e9]",
  imageOffset: 28,
});

const animationTools = buildTools({
  prefix: "MotionArc",
  names: [
    "MotionArc",
    "TweenLab",
    "KeyframeX",
    "LoopCraft",
    "FlowEase",
    "AnimateIQ",
    "FrameWaves",
    "GlyphMotion",
  ],
  description: "Animation toolkits with procedural controls and cinematic polish.",
  descriptions: [
    "Timeline assistant that suggests easing curves based on motion archetypes.",
    "Component library delivering reusable micro-interactions for product UI.",
    "Prototyping stage syncing Figma layers directly into motion scenes.",
    "Loop sequencer exporting lightweight animations for marketing embeds.",
    "Particle playground tuned for hero sections and immersive explainers.",
    "Generative transitions mixed with keyframes for hybrid workflows.",
    "Wave engine crafting kinetic typography with beat alignment.",
    "Icon animation desk with physics presets and asset pipelines.",
  ],
  tags: [
    ["Animation", "Motion"],
    ["UI", "Interaction"],
    ["Prototype", "Import"],
    ["Loop", "Marketing"],
    ["Particle", "Effects"],
    ["Generative", "Hybrid"],
    ["Typography", "Rhythm"],
    ["Icons", "Physics"],
  ],
  badge: "Animation",
  badgeClass: "bg-[#ec4899]",
  imageOffset: 32,
});

const threeDTools = buildTools({
  prefix: "VoxelWave",
  names: [
    "VoxelWave",
    "MeshCraft",
    "RenderGrid",
    "ShapeForge",
    "SolidVision",
    "PolyWorks",
    "DepthLab",
    "OrbitMesh",
  ],
  description: "3D platforms delivering lightning-fast scene iteration and export.",
  descriptions: [
    "Scene composer with lighting presets and marketplace asset drops.",
    "Procedural mesh generator that cleans topology in real time.",
    "Render farm orchestrator with adaptive sampling and queue insights.",
    "CAD-inspired sculpting tools tailored for product teams.",
    "XR-ready viewer bundling annotations, variants, and performance stats.",
    "Material lab mixing PBR textures with collaborative tweaks.",
    "Depth capture toolkit for scanning physical spaces to clean geometry.",
    "Mesh optimization service slimming files for web delivery.",
  ],
  tags: [
    ["3D", "Lighting"],
    ["Mesh", "Procedural"],
    ["Render", "Pipeline"],
    ["Sculpt", "Product"],
    ["XR", "Review"],
    ["Materials", "Collab"],
    ["Scan", "Reality"],
    ["Optimization", "Web"],
  ],
  badge: "3D",
  badgeClass: "bg-[#a855f7]",
  imageOffset: 12,
});

const toolSections = [
  {
    title: "Featured Tools",
    ctaLabel: "View All →",
    tools: featuredTools,
  },
  {
    title: "Latest Tools",
    ctaLabel: "Browse All →",
    tools: latestTools,
  },
  {
    title: "Video",
    ctaLabel: "See Video Picks →",
    tools: videoTools,
  },
  {
    title: "Audio",
    ctaLabel: "Discover Audio Tools →",
    tools: audioTools,
  },
  {
    title: "Image",
    ctaLabel: "Browse Image Tools →",
    tools: imageTools,
  },
  {
    title: "Animation",
    ctaLabel: "Animate Smarter →",
    tools: animationTools,
  },
  {
    title: "3D",
    ctaLabel: "Explore 3D Stack →",
    tools: threeDTools,
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-[14px] border border-[#e9e9ed] bg-white transition-shadow duration-300">
      <div className="group/image relative h-44 overflow-hidden rounded-t-[14px]">
        <Image
          src={tool.image}
          alt={tool.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 ease-out group-hover/image:scale-105"
        />
        <div className="absolute inset-0 bg-[#0b1120]/0 transition-colors duration-300 ease-out group-hover/image:bg-[#0b1120]/45" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
          View Details
        </div>
      </div>
      <div className="relative space-y-3 px-6 pb-6 pt-6">
        <span className="pointer-events-none absolute right-6 top-6 text-xs font-semibold text-[#7f7f88] opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          Details →
        </span>
        <div className="flex items-center gap-2 text-lg font-semibold text-[#1f1f24]">
          <span role="img" aria-label="bookmark" className="text-base">
            🔖
          </span>
          {tool.name}
        </div>
        <p className="text-sm leading-relaxed text-[#5a5a63]">{tool.description}</p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-[#616168]">
          {tool.tags.map((tag) => (
            <span
              key={`${tool.name}-${tag}`}
              className="group/tag relative inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f3f4f9] px-3 py-1 text-[11px] uppercase tracking-wide text-[#616168] transition-colors duration-200 hover:bg-[#ffe8e2]"
            >
              <span className="text-[#ff7d68] transition-transform duration-200 group-hover/tag:scale-125">#</span>
              <span>{tag}</span>
              <span className="pointer-events-none absolute inset-x-2 bottom-0.5 h-0.5 origin-right scale-x-0 bg-[#ff7d68] transition-transform duration-200 group-hover/tag:origin-left group-hover/tag:scale-x-100" />
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />

      <div className="mx-auto flex min-h-screen w-full max-w-[92rem] flex-col px-6 pb-20 pt-12 lg:px-12 xl:px-20">
        <main className="flex flex-1 flex-col items-center pt-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <Link
              href="/category"
              className="flex items-center gap-2 rounded-full border border-[#ffe0d6] bg-white px-5 py-2 text-sm font-medium text-[#ff7d68] shadow-[0_16px_40px_-30px_rgba(255,125,104,1)] transition hover:border-[#ffb8aa] hover:text-[#ff6b54]"
            >
              <span role="img" aria-label="party popper">
                🎉
              </span>
              5 New Tools Added This Week
              <span className="text-base">→</span>
            </Link>
            <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-[#17171c] sm:text-[3.35rem] sm:leading-[1.08]">
              Find <span className="text-[#1f1f1f]">Tools.</span> Explore
              <span className="text-[#ff7d68]"> Categories.</span>
            </h1>
            <p className="max-w-4xl text-base text-[#63636a] sm:text-lg">
              ToolCategory.com helps you discover, organize, and showcase the best digital tools.
              Browse curated collections, follow the latest launches, and submit your product to
              reach more makers.
            </p>
            <div className="mt-2 flex h-14 w-full max-w-5xl items-center rounded-full border border-[#f0efef] bg-white px-4 transition-all duration-300 hover:border-[#ff7d68]/40 hover:shadow-[0_0_0_2px_rgba(255,125,104,0.08)] focus-within:border-[#ff7d68]/70 focus-within:shadow-[0_0_0_2px_rgba(255,125,104,0.15)]">
              <input
                aria-label="Search tools"
                className="h-full w-full rounded-full border-0 bg-transparent text-sm text-[#2d2d32] outline-none placeholder:text-[#b0b0b5] transition-colors duration-300 focus-visible:outline-none"
                placeholder="Search any products you need"
                type="search"
              />
              <Button className="ml-3 h-11 w-11 cursor-pointer rounded-full bg-[#ff7d68] p-0 text-white transition hover:bg-[#ff6b54]">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <CategoryList categories={categories} className="mt-6" />
          </div>

          {toolSections.map((section, index) => (
            <section
              key={section.title}
              className={cn("w-full", index === 0 ? "mt-20" : "mt-16")}
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-[#ff7d68]">
                  <Sparkles className="h-5 w-5" />
                  {section.title}
                </div>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm font-medium text-[#ff7d68] transition hover:text-[#ff6b54]"
                >
                  {section.ctaLabel}
                </Link>
              </div>
              <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                {section.tools.map((tool, toolIndex) => (
                  <ToolCard key={`${section.title}-${tool.name}-${toolIndex}`} tool={tool} />
                ))}
              </div>
            </section>
          ))}

        </main>
      </div>

      <SiteFooter />

      <BackToTopButton />
    </div>
  );
}
