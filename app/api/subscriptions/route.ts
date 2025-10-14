import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email?: unknown }).email === "string"
      ? (body as { email: string }).email.trim()
      : "";

  if (!email) {
    return NextResponse.json(
      { error: "Add your email so we know where to send the good news." },
      { status: 422 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn’t look quite right." },
      { status: 422 },
    );
  }

  try {
    const existing = await db.query.subscriptions.findFirst({
      columns: { id: true },
      where: eq(subscriptions.email, email),
    });

    if (existing) {
      return NextResponse.json({ success: true, isNew: false });
    }

    await db.insert(subscriptions).values({ email });

    return NextResponse.json({ success: true, isNew: true }, { status: 201 });
  } catch (error) {
    const databaseError = error as { code?: string };
    if (databaseError?.code === "23505") {
      return NextResponse.json({ success: true, isNew: false });
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("[subscriptions] failed to save subscription", error);
    }
    return NextResponse.json(
      { error: "We couldn’t save your subscription. Please try again." },
      { status: 500 },
    );
  }
}
