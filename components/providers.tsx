"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import { RouteProgressBar } from "@/components/route-progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <ToastContainer position="top-center" />
      {children}
    </SessionProvider>
  );
}
