"use client";

import { useRef, useState } from "react";
import type { Article } from "@/lib/types";
import { GiftIcon, PlayIcon, ShareIcon } from "@/components/icons";
import BookmarkButton from "./BookmarkButton";

export default function ActionBar({
  article,
  onFontScale,
}: {
  article: Article;
  onFontScale?: (scale: number) => void;
}) {
  const [listening, setListening] = useState(false);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);

  function adjustFont(delta: number) {
    const next = Math.min(1.4, Math.max(0.85, scale + delta));
    setScale(next);
    onFontScale?.(next);
  }

  function listen() {
    if (!("speechSynthesis" in window)) return;
    if (listening) {
      window.speechSynthesis.cancel();
      setListening(false);
      return;
    }
    const text = document.getElementById("article-body")?.textContent ?? "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setListening(false);
    window.speechSynthesis.speak(utterance);
    setListening(true);
  }

  function gift() {
    const url = `${window.location.origin}/article/${article.slug}?gift=1`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`I thought you'd enjoy this from The Daily Brief: ${url}`)}`, "_blank");
  }

  async function share() {
    const url = `${window.location.origin}/article/${article.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`, "_blank");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-hairline-strong py-3">
      <button
        onClick={listen}
        className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-white px-3 py-1.5 text-xs font-semibold hover:bg-accent-dark transition"
      >
        <PlayIcon className="h-3.5 w-3.5" />
        {listening ? "Stop" : `Listen · ${article.read_time ?? 8} min`}
      </button>

      <button onClick={share} className="p-2 rounded-sm border border-hairline-strong hover:border-accent hover:text-accent transition" title="Share">
        <ShareIcon className="h-4 w-4" />
      </button>
      <BookmarkButton articleId={article.id} />
      <button onClick={gift} className="p-2 rounded-sm border border-hairline-strong hover:border-accent hover:text-accent transition" title="Gift this article">
        <GiftIcon className="h-4 w-4" />
      </button>

      <div className="ml-auto flex items-center gap-1 text-xs text-ink-variant">
        <span className="mr-1">Text</span>
        <button onClick={() => adjustFont(-0.1)} className="px-2 py-1 border border-hairline-strong hover:border-accent transition">A−</button>
        <button onClick={() => adjustFont(0.1)} className="px-2 py-1 border border-hairline-strong hover:border-accent transition">A+</button>
      </div>

      {copied && <span className="text-xs text-emerald-600">Link copied</span>}
    </div>
  );
}
