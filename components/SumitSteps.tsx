import { cn } from "@/lib/utils";

const STEP_DEFINITIONS = [
  { id: "details", label: "Details", summary: "Enter product details" },
  { id: "payment", label: "Payment", summary: "Choose pricing plan" },
  { id: "publish", label: "Publish", summary: "Review & publish" },
] as const;

export type SumitStepKey = (typeof STEP_DEFINITIONS)[number]["id"];

type SumitStepsProps = {
  current: SumitStepKey;
  className?: string;
  summaryVisibility?: "none" | "responsive" | "always";
  summaryAlignment?: "start" | "center" | "end";
};

export function SumitSteps({
  current,
  className,
  summaryVisibility = "responsive",
  summaryAlignment = "end",
}: SumitStepsProps) {
  const total = STEP_DEFINITIONS.length;
  const currentIndex = Math.max(
    0,
    STEP_DEFINITIONS.findIndex((step) => step.id === current)
  );
  const currentStep = STEP_DEFINITIONS[currentIndex] ?? STEP_DEFINITIONS[0];

  const summaryVisibilityClass =
    summaryVisibility === "none"
      ? "hidden"
      : summaryVisibility === "always"
        ? "flex"
        : "hidden sm:flex";

  const baseAlignmentClass =
    summaryAlignment === "start"
      ? "justify-start"
      : summaryAlignment === "center"
        ? "justify-center"
        : "justify-center";

  const responsiveAlignmentClass =
    summaryAlignment === "start"
      ? "sm:justify-start"
      : summaryAlignment === "center"
        ? "sm:justify-center"
        : "sm:justify-end";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div
        className={cn(
          "w-full",
          summaryVisibilityClass,
          baseAlignmentClass,
          responsiveAlignmentClass
        )}
      >
        <div className="flex items-center gap-2 rounded-full border border-[#e2e2e8] px-3 py-1 text-xs font-semibold text-[#6a6a74]">
          <span className="rounded-full bg-[#ffede7] px-2 py-0.5 text-[#ff7d68]">
            {currentIndex + 1} / {total}
          </span>
          <span>{currentStep.summary}</span>
        </div>
      </div>
      <nav
        className="flex flex-wrap items-center justify-center gap-12 text-sm font-semibold text-[#8c8c96]"
        aria-label="Submission steps"
      >
        {STEP_DEFINITIONS.map((step, index, arr) => {
          const isActive = step.id === current;
          return (
            <div key={step.id} className="flex items-center gap-6">
              <button
                type="button"
                className={cn(
                  "group flex cursor-default flex-col items-center gap-3 transition",
                  isActive ? "text-[#1f1f24]" : "text-[#a6a6ae]"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-semibold",
                    isActive
                      ? "bg-[#ff7d68] text-white"
                      : "bg-[#f2f2f6] text-[#8a8a92]"
                  )}
                >
                  {index + 1}
                </span>
                <span>{step.label}</span>
              </button>
              {index < arr.length - 1 ? (
                <span className="block h-px w-32 bg-[#f1f1f4]" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function getSumitStepSummary(current: SumitStepKey) {
  const total = STEP_DEFINITIONS.length;
  const index = STEP_DEFINITIONS.findIndex((step) => step.id === current);
  const safeIndex = index >= 0 ? index : 0;
  const step = STEP_DEFINITIONS[safeIndex];

  return {
    index: safeIndex,
    total,
    summary: step.summary,
    label: step.label,
    display: `${safeIndex + 1} / ${total} ${step.summary}`,
  };
}
