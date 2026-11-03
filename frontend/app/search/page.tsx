"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { ArticleCard } from "@/components/ArticleCard";
import { api } from "@/lib/api";
import type { Article } from "@/lib/types";

function SearchContent() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function run(query: string) {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<{ data: Article[]; meta: { total: number } }>(
        `/search?q=${encodeURIComponent(query)}`
      );
      setResults(data.data);
      setTotal(data.meta.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) run(initial);
  }, [initial]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold">Search</h1>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the archive…"
          className="flex-1 max-w-xl rounded-sm border border-hairline-strong bg-surface-low px-4 py-3 text-sm focus:outline-none focus:border-accent"
        />
        <button type="submit" className="rounded-sm bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark transition">
          Search
        </button>
      </form>

      {q.trim() && !loading && <p className="mt-5 text-sm text-ink-variant">{total} result(s) for “{q}”</p>}
      {loading && <p className="mt-5 text-sm text-ink-variant">Searching…</p>}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {results.map((a) => (
          <ArticleCard key={a.id} article={a} showExcerpt />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SiteShell showNewsletter={false}>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8">Loading…</div>}>
        <SearchContent />
      </Suspense>
    </SiteShell>
  );
}
