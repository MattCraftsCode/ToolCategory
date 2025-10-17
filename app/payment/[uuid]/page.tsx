import { notFound, redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { PaymentPageContent } from "@/components/payment-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteForPayment } from "@/lib/data-loaders";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/payment/${uuid}`)}`);
  }

  const site = await getSiteForPayment(uuid);

  if (!site) {
    notFound();
  }

  let userType = "free";

  const [userRecord] = await db
    .select({ userType: users.userType })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userRecord?.userType) {
    userType = userRecord.userType;
  }

  const normalizedUserType = userType.toLowerCase();
  const planLabel = `${normalizedUserType.charAt(0).toUpperCase()}${normalizedUserType.slice(1)}`;

  const primaryCategory = site.categories[0]?.name ?? "Uncategorized";
  const tagLabels =
    site.tags.length > 0
      ? site.tags.map((tag) => `#${tag.name}`)
      : site.categories.map((category) => `#${category.name}`);

  const fallbackTags = tagLabels.length > 0 ? tagLabels : ["#toolcategory"];

  const imageSrc =
    site.image ??
    "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80";

  const createdDateLabel = site.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(site.createdAt)
    : "—";

  const publishedDateLabel = site.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(site.publishedAt)
    : "Not Published";

  const paymentSite = {
    uuid: site.uuid,
    name: site.name,
    description: site.description,
    image: imageSrc,
    category: primaryCategory,
    tags: fallbackTags,
    planLabel,
    createdDateLabel,
    publishedDateLabel,
    link: site.link ?? "",
    isVerified: site.isVerified,
    userType: normalizedUserType,
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />
      <PaymentPageContent site={paymentSite} />
      <SiteFooter />
    </div>
  );
}
