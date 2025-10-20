"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock, Loader2, MegaphoneOff } from "lucide-react";

import { SubmissionPreview } from "@/components/SubmissionPreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type DashboardSubmissionPreview = {
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  plan: string;
  status: string;
  publishDate: string;
  createdDate: string;
  statusColor?: string;
  primaryActionLabel: string;
  primaryActionDisabled: boolean;
};

export type DashboardSubmission = {
  key: string;
  siteUuid: string;
  preview: DashboardSubmissionPreview;
};

type DashboardSubmissionCardProps = {
  submission: DashboardSubmission;
};

export function DashboardSubmissionCard({ submission }: DashboardSubmissionCardProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);

  const handlePrimaryAction = useCallback(() => {
    const { preview, siteUuid } = submission;

    if (preview.primaryActionDisabled) {
      return;
    }

    if (preview.primaryActionLabel === "Verify Badge & Submit") {
      router.push(`/payment/${siteUuid}#backlink-verification`);
      return;
    }

    if (preview.primaryActionLabel === "Unpublish") {
      setShowUnpublishDialog(true);
    }
  }, [router, submission]);

  const handleConfirmUnpublish = useCallback(async () => {
    const { siteUuid } = submission;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/sites/${siteUuid}/unpublish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("[dashboard] failed to unpublish", await response.text());
        return;
      }

      setShowUnpublishDialog(false);
      router.refresh();
    } catch (error) {
      console.error("[dashboard] unpublish request failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [router, submission]);

  const disabled = submission.preview.primaryActionDisabled || isSubmitting;

  const primaryIcon = useMemo(() => {
    switch (submission.preview.primaryActionLabel) {
      case "Verify Badge & Submit":
        return BadgeCheck;
      case "Unpublish":
        return MegaphoneOff;
      case "In Review":
        return Clock;
      default:
        return BadgeCheck;
    }
  }, [submission.preview.primaryActionLabel]);

  const actions = useMemo(
    () => [{ label: "primary", icon: primaryIcon }],
    [primaryIcon]
  );

  return (
    <>
      <SubmissionPreview
        {...submission.preview}
        actions={actions}
        primaryActionDisabled={disabled}
        onPrimaryAction={handlePrimaryAction}
      />

      <Dialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unpublish submission?</DialogTitle>
            <DialogDescription>
              We&apos;ll remove this tool from the published list immediately. You can republish it at any time once you&apos;re ready again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUnpublishDialog(false)}
              className="w-full border-[#ffb8aa] text-[#ff7d68] transition hover:border-[#ff7d68] hover:bg-[#fff1ec] sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUnpublish}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 bg-[#ff7d68] text-white transition hover:bg-[#ff6b54] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MegaphoneOff className="h-4 w-4" />}
              Unpublish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
