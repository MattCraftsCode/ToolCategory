import { NextResponse } from "next/server";

import { getTags } from "@/lib/data-loaders";

export async function GET() {
  const tags = await getTags();
  return NextResponse.json({ tags });
}
