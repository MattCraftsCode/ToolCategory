import { NextResponse } from "next/server";

import { getCategories } from "@/lib/data-loaders";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories: categories.map((item) => item.name) });
}
