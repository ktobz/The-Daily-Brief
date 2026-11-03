import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/ArticleCard";

export default function TopStoriesGrid({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-bold">Top Stories</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
