import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categories,
  siteCategories,
  siteTags,
  sites,
  tags,
} from "@/lib/db/schema";
import { normalizeExternalUrl, slugify } from "@/lib/utils";

type SubmitPayload = {
  link?: string;
  name?: string;
  categories?: string[];
  tags?: string[];
  description?: string;
  introduction?: string;
  imageUrl?: string;
};

type ValidationErrors = {
  link?: string;
  name?: string;
  categories?: string;
  tags?: string;
  description?: string;
  introduction?: string;
  image?: string;
};

export async function POST(request: Request) {
  let body: SubmitPayload;

  try {
    body = (await request.json()) as SubmitPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const errors: ValidationErrors = {};

  const link = typeof body.link === "string" ? body.link.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const introduction =
    typeof body.introduction === "string" ? body.introduction.trim() : "";
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

  const categoriesInput = Array.isArray(body.categories) ? body.categories : [];
  const tagsInput = Array.isArray(body.tags) ? body.tags : [];

  const normalizedLink = normalizeExternalUrl(link);

  if (!link) {
    errors.link = "Provide a link to your product.";
  } else if (!normalizedLink) {
    errors.link = "Enter a valid URL, for example https://example.com.";
  }

  if (!name) {
    errors.name = "Give your product a name.";
  }

  const normalizedCategories = Array.from(
    new Set(
      categoriesInput
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean),
    ),
  );
  if (normalizedCategories.length === 0) {
    errors.categories = "Pick at least one category.";
  }

  const normalizedTags = Array.from(
    new Set(
      tagsInput
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean),
    ),
  );
  if (normalizedTags.length === 0) {
    errors.tags = "Choose a few tags to help discovery.";
  }

  if (!description) {
    errors.description = "Add a short description.";
  }

  if (!introduction) {
    errors.introduction = "Share a longer introduction for your product.";
  }

  if (!imageUrl) {
    errors.image = "Upload a hero image before submitting.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed.", details: errors },
      { status: 422 },
    );
  }

  const session = await auth();
  const rawUserId = session?.user?.id;
  const siteUserId =
    typeof rawUserId === "string" && rawUserId.trim().length > 0
      ? rawUserId.trim()
      : null;

  try {
    const site = await db.transaction(async (tx) => {
      const baseSlug = slugify(name);
      const uniqueSlug = await generateUniqueSiteSlug(tx, baseSlug);

      const normalizedLinkValue = normalizedLink ?? link;

      const [insertedSite] = await tx
        .insert(sites)
        .values({
          name,
          slug: uniqueSlug,
          description,
          introduction,
          image: imageUrl,
          link: normalizedLinkValue,
          userId: siteUserId,
        })
        .returning({ id: sites.id, slug: sites.slug, uuid: sites.uuid });

      const categoryRecords = [] as Array<{ id: number; slug: string; name: string }>;

      for (const categoryName of normalizedCategories) {
        const categorySlug = slugify(categoryName);
        let existing = await tx.query.categories.findFirst({
          where: eq(categories.slug, categorySlug),
        });

        if (!existing) {
          [existing] = await tx
            .insert(categories)
            .values({ name: categoryName, slug: categorySlug })
            .returning({ id: categories.id, slug: categories.slug, name: categories.name });
        }

        if (existing) {
          categoryRecords.push(existing);
        }
      }

      const tagRecords = [] as Array<{ id: number; slug: string; name: string }>;

      for (const tagName of normalizedTags) {
        const tagSlug = slugify(tagName);
        let existing = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });

        if (!existing) {
          [existing] = await tx
            .insert(tags)
            .values({ name: tagName, slug: tagSlug })
            .returning({ id: tags.id, slug: tags.slug, name: tags.name });
        }

        if (existing) {
          tagRecords.push(existing);
        }
      }

      for (const category of categoryRecords) {
        await tx.insert(siteCategories).values({
          siteId: insertedSite.id,
          categoryId: category.id,
        });
      }

      for (const tag of tagRecords) {
        await tx.insert(siteTags).values({
          siteId: insertedSite.id,
          tagId: tag.id,
        });
      }

      return insertedSite;
    });

    return NextResponse.json({ success: true, site }, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[submissions] failed to save", error);
    }
    return NextResponse.json(
      { error: "We couldn’t save your submission. Please try again." },
      { status: 500 },
    );
  }
}

async function generateUniqueSiteSlug(
  tx: typeof db,
  baseSlug: string,
): Promise<string> {
  const safeBase = baseSlug.length > 0 ? baseSlug : "site";
  let candidate = safeBase;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await tx.query.sites.findFirst({
      where: eq(sites.slug, candidate),
      columns: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
}
