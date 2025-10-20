import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  // Only allow authenticated users (you can add admin check here)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagnostics = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PAYPAL_MODE: process.env.PAYPAL_MODE || 'sandbox (default)',
    },
    paypal: {
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? '✅ Set' : '❌ Missing',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
      PAYPAL_API_BASE: process.env.PAYPAL_API_BASE || 'Using default based on mode',
    },
    database: {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    },
    app: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
      APP_URL: process.env.APP_URL || 'Not set',
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(diagnostics);
}