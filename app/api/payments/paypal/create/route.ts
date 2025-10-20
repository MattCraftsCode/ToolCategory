import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { createPayPalOrder } from "@/lib/paypal";

const PLAN_PRICING = {
  basic: { amount: "2.90", label: "Basic" },
  pro: { amount: "12.90", label: "Pro" },
} as const;

const CURRENCY = "USD";

function resolvePlan(planValue: unknown) {
  if (typeof planValue !== "string") {
    return null;
  }
  const normalized = planValue.trim().toLowerCase();
  if (normalized in PLAN_PRICING) {
    const key = normalized as keyof typeof PLAN_PRICING;
    return { key, ...PLAN_PRICING[key] };
  }
  return null;
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: {
    plan?: string;
    siteUuid?: string | null;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const plan = resolvePlan(payload?.plan);

  if (!plan) {
    return NextResponse.json({ error: "Unsupported plan selected." }, { status: 400 });
  }

  const baseUrl = getBaseUrl();
  const siteUuid = typeof payload.siteUuid === "string" ? payload.siteUuid : null;

  const returnUrl = new URL(
    siteUuid ? `/payment/${siteUuid}` : "/pricing",
    baseUrl
  );
  returnUrl.searchParams.set("paypal", "return");

  const cancelUrl = new URL(
    siteUuid ? `/payment/${siteUuid}` : "/pricing",
    baseUrl
  );
  cancelUrl.searchParams.set("paypal", "cancel");

  try {
    // Check PayPal configuration first
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("[paypal:create] PayPal credentials are not configured");
      return NextResponse.json(
        { error: "PayPal is not properly configured. Please contact support." },
        { status: 502 }
      );
    }

    console.log("[paypal:create] Creating order with params:", {
      amount: plan.amount,
      currency: CURRENCY,
      description: `ToolCategory ${plan.label} plan`,
      userId,
      plan: plan.key,
    });

    const order = await createPayPalOrder({
      amount: plan.amount,
      currency: CURRENCY,
      description: `ToolCategory ${plan.label} plan`,
      returnUrl: returnUrl.toString(),
      cancelUrl: cancelUrl.toString(),
    });

    console.log("[paypal:create] PayPal order created:", {
      orderId: order.id,
      status: order.status,
      linksCount: order.links?.length || 0,
    });

    const approvalUrl = order.links?.find((link) => link.rel === "approve")?.href;

    if (!order.id || !approvalUrl) {
      console.error("[paypal:create] Invalid PayPal response:", {
        hasOrderId: !!order.id,
        hasApprovalUrl: !!approvalUrl,
        links: order.links?.map(link => ({ rel: link.rel, href: link.href.substring(0, 50) + "..." })),
      });
      return NextResponse.json(
        { error: "PayPal order creation returned an unexpected response." },
        { status: 502 }
      );
    }

    // Add token parameter to return URL for better tracking
    const returnUrlWithToken = new URL(returnUrl.toString());
    returnUrlWithToken.searchParams.set("token", order.id);

    console.log("[paypal:create] Inserting order into database:", {
      userId,
      plan: plan.key,
      paypalOrderId: order.id,
    });

    await db.insert(orders).values({
      userId,
      plan: plan.key,
      amount: plan.amount,
      currency: CURRENCY,
      paypalOrderId: order.id,
      status: order.status ?? "CREATED",
      siteUuid: siteUuid ?? null,
    });

    console.log("[paypal:create] Order created successfully");

    return NextResponse.json({ approvalUrl });
  } catch (error) {
    console.error("[paypal:create] Detailed error:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId,
      plan: plan.key,
    });

    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes("PayPal credentials")) {
        return NextResponse.json(
          { error: "PayPal configuration error. Please contact support." },
          { status: 502 }
        );
      }
      if (error.message.includes("PayPal auth failed")) {
        return NextResponse.json(
          { error: "PayPal authentication failed. Please try again." },
          { status: 502 }
        );
      }
      if (error.message.includes("PayPal order creation failed")) {
        return NextResponse.json(
          { error: "PayPal service is temporarily unavailable. Please try again." },
          { status: 502 }
        );
      }
      if (error.message.includes("Database") || error.message.includes("relation")) {
        return NextResponse.json(
          { error: "Database error. Please contact support." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to create PayPal order." },
      { status: 502 }
    );
  }
}
