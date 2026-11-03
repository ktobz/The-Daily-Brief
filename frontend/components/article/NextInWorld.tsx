import Link from "next/link";
import type { Article } from "@/lib/types";

export default function NextInWorld({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-14 border-t border-hairline-strong pt-8">
      <h2 className="font-display text-2xl font-bold mb-5">Next in World Affairs</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link key={a.id} href={`/article/${a.slug}`} className="group border border-hairline-strong bg-surface-low p-5 hover:border-accent transition">
            <span className="text-[10px] font-bold uppercase tracking-wide text-accent">
              {a.category?.name ?? "World"}
            </span>
            <h3 className="mt-2 font-serif font-bold leading-snug text-ink group-hover:text-accent transition line-clamp-3">
              {a.title}
            </h3>
            {a.subdeck && <p className="mt-2 text-sm text-ink-variant line-clamp-2">{a.subdeck}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
