import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { API_URL } from "@/lib/constants";
import { getEdition } from "@/lib/edition";
import { timeAgo, formatTime } from "@/lib/format";
import type { Article } from "@/lib/types";

async function getWire(edition: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/articles?per_page=60&edition=${encodeURIComponent(edition)}`, { next: { revalidate: 15 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as Article[];
  } catch {
    return [];
  }
}

export default async function WirePage() {
  const edition = await getEdition();
  const articles = await getWire(edition);

  return (
    <SiteShell showNewsletter={false} edition={edition}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <header className="flex items-center justify-between border-b-2 border-accent pb-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">The Wire</h1>
            <p className="text-sm text-ink-variant">Latest dispatches, newest first.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-wide px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Live
          </span>
        </header>

        <ol className="divide-y divide-hairline">
          {articles.map((a) => (
            <li key={a.id}>
              <Link href={`/article/${a.slug}`} className="group flex items-start gap-4 py-3.5 hover:bg-surface-low -mx-2 px-2 transition">
                <span className="shrink-0 font-mono text-xs text-accent tabular-nums w-14 pt-0.5">
                  {formatTime(a.published_at)}
                </span>
                <span className="min-w-0 flex-1">
                  {a.category && (
                    <span
                      className="block text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: a.category.color || "#b91c1c" }}
                    >
                      {a.category.name}
                    </span>
                  )}
                  <span className="block font-serif text-[17px] font-bold leading-snug text-ink group-hover:text-accent transition">
                    {a.title}
                  </span>
                  {a.subdeck && (
                    <span className="block mt-1 text-sm text-ink-variant leading-relaxed line-clamp-2">
                      {a.subdeck}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-ink-variant pt-0.5">{timeAgo(a.published_at)}</span>
              </Link>
            </li>
          ))}
        </ol>

        {articles.length === 0 && <p className="text-ink-variant">No dispatches available.</p>}
      </div>
    </SiteShell>
  );
}
