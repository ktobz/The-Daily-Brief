import Link from "next/link";
import type { Article } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { CategoryKicker } from "@/components/ArticleCard";
import { BookmarkIcon } from "@/components/icons";

export default function LeadArticle({ article }: { article: Article }) {
  if (!article) return null;

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`}>
        <div className="relative overflow-hidden rounded-sm bg-surface-container aspect-[16/9]">
          {article.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-ink-variant font-display text-6xl">
              DB
            </div>
          )}
          {article.is_premium && (
            <span className="absolute top-3 right-3 rounded-sm bg-ink/85 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
              Premium
            </span>
          )}
        </div>
      </Link>
      <div className="mt-4">
        <CategoryKicker article={article} />
        <Link href={`/article/${article.slug}`}>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-[1.15] text-ink group-hover:text-accent transition">
            {article.title}
          </h1>
        </Link>
        {article.subdeck && (
          <p className="mt-3 font-serif text-lg text-ink-variant leading-relaxed line-clamp-2">
            {article.subdeck}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-ink-variant">
          {article.author && <span className="font-semibold text-ink">{article.author.name}</span>}
          {article.published_at && <span>{timeAgo(article.published_at)}</span>}
          {article.read_time && <span>· {article.read_time} min read</span>}
        </div>
      </div>
    </article>
  );
}
