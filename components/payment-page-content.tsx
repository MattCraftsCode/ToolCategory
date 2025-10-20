"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import { BacklinkVerification } from "@/components/BacklinkVerification";
import { PricingPlans, type PlanDefinition } from "@/components/PricingPlans";
import { SubmissionPreview } from "@/components/SubmissionPreview";
import { SumitSteps } from "@/components/SumitSteps";

type PaymentSiteData = {
  uuid: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  planLabel: string;
  createdDateLabel: string;
  publishedDateLabel: string;
  link: string;
  isVerified: boolean;
  userType: string;
};

type PaymentPageContentProps = {
  site: PaymentSiteData;
};

export function PaymentPageContent({ site }: PaymentPageContentProps) {
  const backlinkSectionRef = useRef<HTMLElement | null>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [highlightBacklink, setHighlightBacklink] = useState(false);
  const [isVerified, setIsVerified] = useState(site.isVerified);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [isCapturingOrder, setIsCapturingOrder] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasCapturedRef = useRef(false);

  const normalizedUserType = site.userType.toLowerCase();
  const isPaidUser = normalizedUserType !== "free";
  const planLabel = site.planLabel;

  const { data: session } = useSession();

  const requireLogin = useCallback(() => {
    if (session?.user?.id) {
      return false;
    }
    const callback =
      typeof window !== "undefined" ? window.location.href : `/payment/${site.uuid}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
    return true;
  }, [router, session?.user?.id, site.uuid]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setIsVerified(site.isVerified);
  }, [site.isVerified]);

  const badgeStatusLabel = isPaidUser
    ? "Badge verification not required"
    : isVerified
      ? "Badge Verified"
      : "Badge Verification Required";
  const statusColor = isPaidUser || isVerified ? "#32b872" : undefined;
  const publishLabel = site.publishedDateLabel || "Not Published";

  const initiatePayPalCheckout = useCallback(
    async (planName: string) => {
      try {
        setProcessingPlan(planName);

        const response = await fetch("/api/payments/paypal/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planName, siteUuid: site.uuid }),
        });

        const result = (await response.json().catch(() => null)) as
          | { approvalUrl?: string; error?: string }
          | null;

        if (!response.ok || !result?.approvalUrl) {
          throw new Error(result?.error ?? "Failed to start PayPal checkout.");
        }

        window.location.href = result.approvalUrl;
      } catch (error) {
        console.error("[paypal] checkout start failed", error);
        toast.error(
          error instanceof Error ? error.message : "Unable to redirect to PayPal checkout."
        );
        setProcessingPlan(null);
      }
    },
    [site.uuid]
  );

  useEffect(() => {
    const paypalStatus = searchParams.get("paypal");
    const orderToken = searchParams.get("token");

    if (paypalStatus === "cancel") {
      toast("PayPal checkout was cancelled.");
      router.replace(pathname);
      return;
    }

    if (paypalStatus === "return" && orderToken && !hasCapturedRef.current) {
      hasCapturedRef.current = true;
      setIsCapturingOrder(true);

      (async () => {
        try {
          const response = await fetch("/api/payments/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: orderToken }),
          });

          const result = (await response.json().catch(() => null)) as
            | { success?: boolean; status?: string; plan?: string; error?: string }
            | null;

          if (!response.ok || !result) {
            throw new Error(result?.error ?? "Unable to finalize PayPal payment.");
          }

          const status = result.status ?? (result.success ? "COMPLETED" : "UNKNOWN");
          setCaptureStatus(`PayPal payment status: ${status}`);

          if (result.success) {
            const planLabel = result.plan === "pro" ? "Pro" : "Basic";
            toast.success(`Payment completed for the ${planLabel} plan.`);
          } else {
            toast(`PayPal returned status ${status}.`);
          }
        } catch (error) {
          console.error("[paypal] capture failed", error);
          toast.error(
            error instanceof Error ? error.message : "Unable to finalize PayPal payment."
          );
        } finally {
          setIsCapturingOrder(false);
          setProcessingPlan(null);
          router.replace(pathname);
        }
      })();
    }
  }, [pathname, router, searchParams]);

  const handlePlanSelect = useCallback(
    (plan: PlanDefinition) => {
      if (requireLogin()) {
        return;
      }

      const planName = plan.name.trim().toLowerCase();

      if (planName === "free") {
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }

        setHighlightBacklink(true);

        const section = backlinkSectionRef.current;
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          window.requestAnimationFrame(() => {
            section.focus();
          });
        }

        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightBacklink(false);
          highlightTimeoutRef.current = null;
        }, 2000);
        return;
      }

      void initiatePayPalCheckout(plan.name);
    },
    [initiatePayPalCheckout, requireLogin]
  );

  return (
    <main className="mx-auto flex w-full max-w-[92rem] flex-col px-6 pb-24 pt-16 lg:px-12 xl:px-20">
      <section className="space-y-12">
        <header className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ff6d57]">
                Submission {site.uuid}
              </p>
              <h1 className="text-[2.4rem] font-semibold tracking-tight text-[#17171c]">
                Payment & confirmation
              </h1>
              <p className="max-w-2xl text-sm text-[#6a6a74]">
                Secure your listing and unlock promotion perks across ToolCategory. Choose a plan,
                confirm billing, and you&apos;ll be ready to publish in the final step.
              </p>
            </div>
            <div className="rounded-[16px] border border-[#f0d9d3] bg-white px-5 py-4 text-xs text-[#8a5d53]">
              <p className="font-semibold uppercase tracking-[0.18em] text-[#ff6d57]">Need help?</p>
              <p className="mt-1 leading-relaxed">
                Message us anytime in <span className="font-semibold">#payment-support</span> or
                reply to your confirmation email.
              </p>
            </div>
          </div>
          <SumitSteps current="payment" />
        </header>

        {isCapturingOrder || captureStatus ? (
          <div className="rounded-[16px] border border-[#d9e8ff] bg-[#f3f8ff] px-5 py-4 text-sm text-[#2b4c73]">
            {isCapturingOrder ? "Finalizing your PayPal payment..." : captureStatus}
          </div>
        ) : null}

        <SubmissionPreview
          title={site.name}
          description={site.description}
          image={site.image}
          category={site.category}
          tags={site.tags}
          plan={planLabel}
          status={badgeStatusLabel}
          publishDate={publishLabel}
          createdDate={site.createdDateLabel}
          statusColor={statusColor}
        />

        {isPaidUser ? (
          <section className="rounded-[18px] border border-[#e5e5ea] bg-white p-10 text-center text-[#ff6d57]">
            <p className="text-lg">
              You&apos;re already on one of our paid plans, so badge verification isn&apos;t required.
            </p>
            <p className="mt-2 text-lg">
              We&apos;re fast-tracking the review of your site—thanks for your patience!
            </p>
          </section>
        ) : (
          <section className="space-y-8 rounded-[18px] border border-[#e5e5ea] bg-white p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1f1f24]">Choose your plan</h2>
                <p className="text-sm text-[#8c8c96]">
                  Upgrade anytime or combine plans as your launch evolves.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#e2e2e8] px-3 py-1 text-xs font-semibold text-[#6a6a74]">
                <ShieldCheck className="h-4 w-4 text-[#ff7d68]" />
                Secure checkout powered by Lemon Squeezy
              </div>
            </div>

            <PricingPlans
              className="md:grid-cols-2 xl:grid-cols-3"
              onPlanSelect={handlePlanSelect}
              processingPlanName={processingPlan}
            />
          </section>
        )}

        {!isPaidUser ? (
          <BacklinkVerification
            ref={backlinkSectionRef}
            highlight={highlightBacklink}
            siteUuid={site.uuid}
            siteSlug={site.slug}
            defaultUrl={site.link}
            isVerified={isVerified}
            onVerified={() => setIsVerified(true)}
          />
        ) : null}
      </section>
    </main>
  );
}
