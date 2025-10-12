import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

type SubmissionAction = {
  label: string;
  icon: LucideIcon;
};

type SubmissionPreviewProps = {
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  plan: string;
  status: string;
  publishDate: string;
  createdDate: string;
  className?: string;
  actions?: SubmissionAction[];
  variant?: "default" | "dashboard";
};

export function SubmissionPreview({
  title,
  description,
  image,
  category,
  tags,
  plan,
  status,
  publishDate,
  createdDate,
  className,
  actions,
  variant = "default",
}: SubmissionPreviewProps) {
  const hasActions = Boolean(actions?.length);
  const isDashboard = variant === "dashboard";

  return (
    <section className={cn("w-full rounded-[32px] border border-[#ebecf3] bg-white/95 p-8", className)}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="group relative overflow-hidden rounded-[18px]">
          <Image
            src={image}
            alt={`${title} preview`}
            width={464}
            height={260}
            className="h-[260px] w-full rounded-[18px] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 text-xs">
            <span className="inline-flex w-fit items-center rounded-full bg-[#1f2330]/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-white backdrop-blur">
              {category}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {tags.map((tag) => (
                <span key={tag} className="relative cursor-pointer text-[#d4d7e2] transition-colors hover:text-white">
                  <span className="peer">{tag}</span>
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-white/80 transition-transform duration-300 peer-hover:scale-x-100" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-8",
            hasActions ? "justify-between" : "justify-start"
          )}
        >
          <div className="space-y-2.5">
            <h2 className="text-[1.75rem] font-semibold text-[#17171c]">{title}</h2>
            <p className="text-sm leading-relaxed text-[#5a5a63]">{description}</p>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {[{ label: "Plan", value: plan }, { label: "Status", value: status }, { label: "Publish Date", value: publishDate }, { label: "Created Date", value: createdDate }].map(({ label, value }) => (
                <div key={label} className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a1a1aa]">
                    {label}
                  </span>
                  <span className="block text-base font-semibold text-[#1f1f24]">{value}</span>
                </div>
              ))}
            </div>

            {hasActions ? (
              <div className="mt-2 flex flex-wrap gap-3">
                {actions!.map((action) => (
                  <Button
                    key={action.label}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e4e4eb] bg-white px-4 py-2 text-sm font-semibold text-[#1f1f24] shadow-none transition hover:border-[#ff6d57] hover:text-[#ff6d57]"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
