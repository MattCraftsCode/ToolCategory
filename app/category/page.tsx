import { CategoryPageContent } from "@/components/category-page-content";
import { SiteFooter } from "@/components/site-footer";
import { loadDiscoveryData } from "@/lib/tag-page-data";

export default async function CategoryPage() {
  const { tools, categories, tags } = await loadDiscoveryData();

  return (
    <CategoryPageContent
      initialCategorySlug={null}
      tools={tools}
      categoryOptions={categories}
      tagOptions={tags}
      footer={<SiteFooter />}
    />
  );
}
