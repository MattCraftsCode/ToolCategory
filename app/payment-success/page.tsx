import { Suspense } from "react";
import { SiteFooter } from "@/components/site-footer";
import PaymentSuccessContent from "@/components/payment-success-content";

export default function PaymentSuccessPage() {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-white via-[#fff7f5] to-[#fff0ee] text-[#1f1f1f]">
          <div className="container mx-auto px-4 py-16">
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="w-full max-w-2xl text-center">
                <div className="mb-8 flex justify-center">
                  <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200"></div>
                </div>
                <div className="mb-6 space-y-4">
                  <div className="h-12 w-3/4 mx-auto animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 mx-auto animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-[#ff7d68] border-t-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
      <SiteFooter />
    </>
  );
}
