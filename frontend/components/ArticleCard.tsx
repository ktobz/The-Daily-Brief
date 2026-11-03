import Link from "next/link";
import type { Article } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { BookmarkIcon } from "./icons";

export function CategoryKicker({ article }: { article: Article }) {
  if (!article.category) return null;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-[0.15em]"
      style={{ color: article.category.color || "#b91c1c" }}
    >
      {article.category.name}
    </span>
  );
}

export function ArticleCard({
  article,
  showExcerpt = false,
}: {
  article: Article;
  showExcerpt?: boolean;
}) {
  return (
    <article className="group">
      <Link href={`/article/${article.slug}`}>
        <div className="overflow-hidden rounded-sm bg-surface-container aspect-[16/10]">
          {article.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-surface-container flex items-center justify-center text-ink-variant font-display text-3xl">
              DB
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3">
        <CategoryKicker article={article} />
        <Link href={`/article/${article.slug}`}>
          <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-ink group-hover:text-accent transition line-clamp-3">
            {article.title}
          </h3>
        </Link>
        {showExcerpt && article.subdeck && (
          <p className="mt-1.5 text-sm text-ink-variant leading-relaxed line-clamp-2">{article.subdeck}</p>
        )}
        <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-variant">
          {article.published_at && <span>{timeAgo(article.published_at)}</span>}
          {article.read_time && (
            <>
              <span className="text-hairline-strong">•</span>
              <span>{article.read_time} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
