"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BookmarkIcon, BookmarkSolidIcon } from "@/components/icons";

export default function BookmarkButton({
  articleId,
  initialBookmarked = false,
}: {
  articleId: number;
  initialBookmarked?: boolean;
}) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBusy(true);
    try {
      if (bookmarked) {
        await api.delete("/bookmarks", { article_id: articleId });
        setBookmarked(false);
      } else {
        await api.post("/bookmarks", { article_id: articleId });
        setBookmarked(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={bookmarked ? "Remove bookmark" : "Save story"}
      title={bookmarked ? "Saved" : "Save"}
      className="p-2 rounded-sm border border-hairline-strong hover:border-accent hover:text-accent transition"
    >
      {bookmarked ? <BookmarkSolidIcon className="h-4 w-4 text-accent" /> : <BookmarkIcon className="h-4 w-4" />}
    </button>
  );
}
