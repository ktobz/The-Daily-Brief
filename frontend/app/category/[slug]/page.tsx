import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { ArticleCard } from "@/components/ArticleCard";
import { API_URL } from "@/lib/constants";
import { getEdition } from "@/lib/edition";
import type { Article, Category } from "@/lib/types";

interface CategoryResponse {
  category: Category;
  data: Article[];
  meta: { current_page: number; last_page: number; total: number };
}

async function getCategory(slug: string, edition: string): Promise<CategoryResponse | null> {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}?edition=${encodeURIComponent(edition)}`, { next: { revalidate: 30 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed");
    return (await res.json()) as CategoryResponse;
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEdition();
  const data = await getCategory(slug, edition);
  if (!data) notFound();

  return (
    <SiteShell showNewsletter={false} edition={edition}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <nav className="text-xs text-ink-variant mb-4">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-ink font-medium">{data.category.name}</span>
        </nav>

        <header className="border-b-4 pb-4 mb-8" style={{ borderColor: data.category.color || "#b91c1c" }}>
          <h1 className="font-display text-4xl font-bold text-ink">{data.category.name}</h1>
          {data.category.description && (
            <p className="mt-2 text-ink-variant max-w-2xl">{data.category.description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {data.data.map((article) => (
            <ArticleCard key={article.id} article={article} showExcerpt />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
