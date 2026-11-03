"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { isFirebaseConfigured, listenToComments } from "@/lib/firebase";
import { timeAgo } from "@/lib/format";
import type { Comment } from "@/lib/types";

export default function DiscussionFeed({
  articleId,
  initialComments,
}: {
  articleId: number;
  initialComments: Comment[];
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let unsub: (() => void) | undefined;
    listenToComments(articleId, (live) => {
      const mapped: Comment[] = live.map((c) => ({
        id: c.id,
        body: c.body,
        author_name: c.authorName,
        reactions: c.reactions ?? 0,
        verified: c.verified ?? false,
        created_at: c.createdAt ? new Date(c.createdAt.toDate()).toISOString() : undefined,
      }));
      setComments(mapped);
    }).then((fn) => (unsub = fn));
    return () => unsub?.();
  }, [articleId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      const res = await api.post<{ data: Comment }>(`/articles/${articleId}/comments`, { body: body.trim() });
      setComments((prev) => [...prev, res.data]);
      setBody("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  }

  async function react(commentId: number | string) {
    try {
      const res = await api.post<{ reactions: number }>(`/comments/${commentId}/react`);
      if (!isFirebaseConfigured()) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, reactions: res.reactions } : c))
        );
      }
    } catch {
      // ignore
    }
  }

  return (
    <section className="mt-12 border-t border-hairline-strong pt-8">
      <h2 className="font-display text-2xl font-bold">
        Discussion <span className="text-accent">({comments.length})</span>
      </h2>

      {user ? (
        <form onSubmit={submit} className="mt-5 flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold">
            {user.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              required
              placeholder="Add to the discussion…"
              className="w-full rounded-sm border border-hairline-strong bg-surface-low px-3 py-2.5 text-sm focus:outline-none focus:border-accent resize-y"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={posting}
                className="rounded-sm bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition disabled:opacity-50"
              >
                Post comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mt-5 text-sm text-ink-variant">
          <a href="/login" className="font-semibold text-accent hover:underline">Sign in</a> to join the discussion.
        </p>
      )}

      <div className="mt-6 space-y-6">
        {comments.length === 0 && <p className="text-ink-variant">Be the first to comment.</p>}
        {comments.map((c) => (
          <div key={String(c.id)} className="flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-surface-container text-ink-variant flex items-center justify-center font-display font-bold text-sm uppercase">
              {(c.author_name?.[0] || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{c.author_name}</span>
                {c.verified && (
                  <span className="rounded-full bg-accent/10 text-accent text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
                    Verified
                  </span>
                )}
                {c.created_at && <span className="text-xs text-ink-variant">{timeAgo(c.created_at)}</span>}
              </div>
              <p className="mt-1 text-[15px] leading-relaxed text-ink whitespace-pre-line">{c.body}</p>
              <button
                onClick={() => react(c.id)}
                className="mt-1.5 text-xs text-ink-variant hover:text-accent transition"
              >
                ▲ {c.reactions ?? 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
