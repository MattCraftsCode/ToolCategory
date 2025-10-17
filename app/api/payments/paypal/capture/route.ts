import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { capturePayPalOrder } from "@/lib/paypal";

const PLAN_TO_USER_TYPE = {
  basic: "basic",
  pro: "pro",
} as const;

type CapturePayload = {
  orderId?: string;
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: CapturePayload;

  try {
    payload = (await request.json()) as CapturePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const orderId = payload.orderId?.trim();

  if (!orderId) {
    return NextResponse.json({ error: "Missing PayPal order id." }, { status: 400 });
  }

  const existingOrder = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      plan: orders.plan,
      status: orders.status,
    })
    .from(orders)
    .where(and(eq(orders.paypalOrderId, orderId), eq(orders.userId, userId)))
    .limit(1);

  const orderRecord = existingOrder[0];

  if (!orderRecord) {
    return NextResponse.json({ error: "Order not found for this user." }, { status: 404 });
  }

  if (orderRecord.status?.toUpperCase() === "COMPLETED") {
    return NextResponse.json({ success: true, plan: orderRecord.plan, alreadyCompleted: true });
  }

  try {
    const capture = await capturePayPalOrder(orderId);

    const captureStatus = capture.status ?? "COMPLETED";
    const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null;

    await db
      .update(orders)
      .set({
        status: captureStatus,
        paypalCaptureId: captureId,
        updatedAt: new Date(),
      })
      .where(eq(orders.paypalOrderId, orderId));

    const normalizedStatus = captureStatus.toUpperCase();
    const planKey = orderRecord.plan as keyof typeof PLAN_TO_USER_TYPE;

    if (normalizedStatus === "COMPLETED" && planKey in PLAN_TO_USER_TYPE) {
      const nextUserType = PLAN_TO_USER_TYPE[planKey];
      await db
        .update(users)
        .set({ userType: nextUserType })
        .where(eq(users.id, userId));
    }

    return NextResponse.json({
      success: normalizedStatus === "COMPLETED",
      status: normalizedStatus,
      plan: orderRecord.plan,
    });
  } catch (error) {
    console.error("[paypal:capture] failed", error);
    return NextResponse.json(
      { error: "Unable to capture PayPal order." },
      { status: 502 }
    );
  }
}
