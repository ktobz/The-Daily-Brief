import Link from "next/link";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/ArticleCard";

export default function CategoryRail({
  title,
  color,
  slug,
  articles,
}: {
  title: string;
  color?: string;
  slug: string;
  articles: Article[];
}) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5 border-b-2 pb-2" style={{ borderColor: color || "#b91c1c" }}>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <Link href={`/category/${slug}`} className="text-sm font-semibold text-accent hover:underline">
          More →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} showExcerpt />
        ))}
      </div>
    </section>
  );
}
