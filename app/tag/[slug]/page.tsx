import { TagPageContent } from "@/components/tag-page-content";
import { loadDiscoveryData } from "@/lib/tag-page-data";

type TagSlugPageProps = {
  params: {
    slug: string;
  };
};

export default async function TagSlugPage({ params }: TagSlugPageProps) {
  const { slug } = params;
  const { tools, categories, tags } = await loadDiscoveryData();

  return (
    <TagPageContent
      initialTagSlug={decodeURIComponent(slug)}
      tools={tools}
      categoryOptions={categories}
      tagOptions={tags}
    />
  );
}
