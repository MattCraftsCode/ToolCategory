"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import { RouteProgressBar } from "@/components/route-progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RouteProgressBar />
      <ToastContainer position="top-center" />
      {children}
    </SessionProvider>
  );
}
