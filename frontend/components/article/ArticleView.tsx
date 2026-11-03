"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article, Comment } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/format";
import { CategoryKicker } from "@/components/ArticleCard";
import ActionBar from "./ActionBar";
import DataGraphic from "./DataGraphic";
import DiscussionFeed from "./DiscussionFeed";
import NextInWorld from "./NextInWorld";

export default function ArticleView({
  article,
  related,
  nextInWorld,
  initialComments,
}: {
  article: Article;
  related: Article[];
  nextInWorld: Article[];
  initialComments: Comment[];
}) {
  const [fontScale, setFontScale] = useState(1);

  const authors = article.co_authors && article.co_authors.length > 0 ? article.co_authors : [article.author];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-ink-variant mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent">Home</Link>
        {article.category && (
          <>
            <span>/</span>
            <Link href={`/category/${article.category.slug}`} className="hover:text-accent">
              {article.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink truncate max-w-[40ch]">{article.title}</span>
        {article.edition && (
          <span className="ml-2 rounded-sm bg-accent/10 text-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            {article.edition}
          </span>
        )}
      </nav>

      <div className="grid lg:grid-cols-3 gap-10">
        <article className="lg:col-span-2">
          <CategoryKicker article={article} />
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-[1.15] text-ink">
            {article.title}
          </h1>
          {article.subdeck && (
            <p className="mt-3 font-serif text-lg text-ink-variant leading-relaxed">{article.subdeck}</p>
          )}

          {/* Byline */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-hairline-strong py-4">
            {authors.map((a, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold">
                  {(a?.name?.[0] || "A").toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-ink">{a?.name || "The Daily Brief"}</p>
                  <p className="text-xs text-ink-variant">{a?.role || "Correspondent"}</p>
                </div>
              </div>
            ))}
            <div className="text-xs text-ink-variant ml-auto">
              <p>{article.published_at ? formatDate(article.published_at) : ""}</p>
              <p>· {article.read_time ?? 8} min read</p>
            </div>
          </div>

          <div className="mt-4">
            <ActionBar article={article} onFontScale={setFontScale} />
          </div>

          {/* Lead image */}
          {article.image && (
            <figure className="mt-6">
              <div className="overflow-hidden rounded-sm bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="w-full object-cover" />
              </div>
              {article.image_caption && (
                <figcaption className="mt-2 text-xs text-ink-variant italic">{article.image_caption}</figcaption>
              )}
            </figure>
          )}

          {/* Body */}
          <div id="article-body" className="mt-8">
            {article.is_locked ? (
              <>
                <div
                  className="prose-article paywall-blur max-h-[440px] overflow-hidden"
                  style={{ fontSize: `${fontScale}rem` }}
                  dangerouslySetInnerHTML={{ __html: article.body ?? "" }}
                />
                <div className="mt-8 border border-hairline-strong bg-surface-low p-8 text-center">
                  <h2 className="font-display text-2xl font-bold">This is a premium story</h2>
                  <p className="mt-2 text-ink-variant max-w-md mx-auto">
                    Support independent journalism and unlock every investigation, interview and analysis.
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/plans" className="rounded-sm bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-dark transition">
                      Subscribe now
                    </Link>
                    <Link href="/login" className="rounded-sm border border-hairline-strong px-6 py-2.5 font-semibold hover:bg-surface-container transition">
                      Sign in
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="prose-article"
                style={{ fontSize: `${fontScale}rem` }}
                dangerouslySetInnerHTML={{ __html: article.body ?? "" }}
              />
            )}
          </div>

          {/* Quote */}
          {article.subdeck && (
            <blockquote className="border-l-[3px] border-accent my-8 pl-6 font-display text-2xl italic text-ink leading-snug">
              “{article.subdeck}”
            </blockquote>
          )}

          {/* Data graphic */}
          <DataGraphic data={article.data_graphic} />

          {/* Key facts */}
          {article.key_facts && article.key_facts.length > 0 && (
            <div className="my-8 border border-hairline-strong bg-surface-low p-5">
              <h3 className="font-display font-bold text-ink mb-3">At a glance</h3>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {article.key_facts.map((f, i) => (
                  <div key={i}>
                    <dt className="text-[11px] uppercase tracking-wide text-ink-variant">{f.label}</dt>
                    <dd className="font-serif font-bold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t} className="rounded-full bg-surface-container px-3 py-1 text-xs text-ink-variant">
                  {t}
                </span>
              ))}
            </div>
          )}

          <DiscussionFeed articleId={article.id} initialComments={initialComments} />
        </article>

        {/* Side rail */}
        <aside className="space-y-8">
          <div className="lg:sticky lg:top-20 space-y-8">
            {/* In This Article */}
            {article.key_facts && article.key_facts.length > 0 && (
              <div className="border border-hairline-strong bg-surface-low p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-variant mb-3">In This Article</h3>
                <ul className="space-y-2 text-sm">
                  {article.key_facts.map((f, i) => (
                    <li key={i}>
                      <span className="text-accent mr-2">—</span>
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author bio */}
            {article.author && (
              <div className="border border-hairline-strong bg-surface-low p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent text-white flex items-center justify-center font-display text-lg font-bold">
                    {(article.author.name?.[0] || "A").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{article.author.name}</p>
                    <p className="text-xs text-ink-variant">{article.author.role || "Correspondent"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Related reporting */}
            {related.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-variant mb-4">Related Reporting</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id} href={`/article/${r.slug}`} className="group flex gap-3">
                      <div className="w-20 h-14 shrink-0 overflow-hidden rounded-sm bg-surface-container">
                        {r.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.image} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-[15px] font-bold leading-snug text-ink group-hover:text-accent transition line-clamp-2">
                          {r.title}
                        </h4>
                        {r.published_at && <span className="text-[11px] text-ink-variant">{timeAgo(r.published_at)}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <NextInWorld articles={nextInWorld} />
    </div>
  );
}
