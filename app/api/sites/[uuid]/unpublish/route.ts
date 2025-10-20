import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

export async function POST(
  _request: Request,
  context: { params: { uuid: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const uuid = context.params.uuid;

  if (!uuid) {
    return new NextResponse("Missing site identifier", { status: 400 });
  }

  const [site] = await db
    .select({ id: sites.id, userId: sites.userId })
    .from(sites)
    .where(eq(sites.uuid, uuid))
    .limit(1);

  if (!site) {
    return new NextResponse("Site not found", { status: 404 });
  }

  if (site.userId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await db
    .update(sites)
    .set({ publishedAt: null })
    .where(eq(sites.id, site.id));

  return NextResponse.json({ success: true });
}
