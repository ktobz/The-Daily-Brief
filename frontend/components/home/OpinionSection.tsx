import Link from "next/link";
import type { Article } from "@/lib/types";

export default function OpinionSection({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-bold">Opinion</h2>
        <Link href="/category/opinion" className="text-sm font-semibold text-accent hover:underline">
          All essays →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
        {articles.slice(0, 4).map((article, i) => {
          const initial = (article.author?.name?.[0] || "A").toUpperCase();
          return (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group border border-hairline-strong bg-surface-low p-5 flex flex-col shrink-0 w-[260px] sm:w-[300px] lg:w-auto"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent text-white flex items-center justify-center font-display text-lg font-bold shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-ink truncate">
                    {article.author?.name || "Columnist"}
                  </p>
                  <p className="text-[11px] text-ink-variant uppercase tracking-wide">Columnist</p>
                </div>
              </div>
              <p className="mt-4 font-serif italic text-[15px] leading-relaxed text-ink-variant flex-1 line-clamp-4">
                “{article.subdeck || article.title}”
              </p>
              <span className="mt-4 text-[11px] font-bold uppercase tracking-wide text-accent group-hover:underline">
                Read essay
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
