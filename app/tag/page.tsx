import { TagPageContent } from "@/components/tag-page-content";
import { SiteFooter } from "@/components/site-footer";
import { loadDiscoveryData } from "@/lib/tag-page-data";

export default async function TagPage() {
  const { tools, categories, tags } = await loadDiscoveryData();

  return (
    <TagPageContent
      initialTagSlug={null}
      tools={tools}
      categoryOptions={categories}
      tagOptions={tags}
      footer={<SiteFooter />}
    />
  );
}
