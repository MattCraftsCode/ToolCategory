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
    const order = await createPayPalOrder({
      amount: plan.amount,
      currency: CURRENCY,
      description: `ToolCategory ${plan.label} plan`,
      returnUrl: returnUrl.toString(),
      cancelUrl: cancelUrl.toString(),
    });

    const approvalUrl = order.links?.find((link) => link.rel === "approve")?.href;

    if (!order.id || !approvalUrl) {
      return NextResponse.json(
        { error: "PayPal order creation returned an unexpected response." },
        { status: 502 }
      );
    }

    await db.insert(orders).values({
      userId,
      plan: plan.key,
      amount: plan.amount,
      currency: CURRENCY,
      paypalOrderId: order.id,
      status: order.status ?? "CREATED",
      siteUuid: siteUuid ?? null,
    });

    return NextResponse.json({ approvalUrl });
  } catch (error) {
    console.error("[paypal:create] failed", error);
    return NextResponse.json(
      { error: "Unable to create PayPal order." },
      { status: 502 }
    );
  }
}
