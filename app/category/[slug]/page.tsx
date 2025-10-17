import { CategoryPageContent } from "@/components/category-page-content";
import { loadDiscoveryData } from "@/lib/tag-page-data";

type CategorySlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategorySlugPage({ params }: CategorySlugPageProps) {
  const { slug } = await params;
  const { tools, categories, tags } = await loadDiscoveryData();

  return (
    <CategoryPageContent
      initialCategorySlug={decodeURIComponent(slug)}
      tools={tools}
      categoryOptions={categories}
      tagOptions={tags}
    />
  );
}
