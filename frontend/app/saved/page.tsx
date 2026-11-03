"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { ArticleCard } from "@/components/ArticleCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Article } from "@/lib/types";

export default function SavedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get<{ data: Article[] }>("/bookmarks").then((r) => setArticles(r.data)).catch(console.error);
  }, [user]);

  if (loading) {
    return <SiteShell showNewsletter={false}><div className="mx-auto max-w-7xl px-4 py-16">Loading…</div></SiteShell>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <SiteShell showNewsletter={false}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold mb-6">Saved stories</h1>
        {articles.length === 0 ? (
          <p className="text-ink-variant">
            No saved stories yet. Tap the bookmark icon on any article to save it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
