"use client";

import { useState } from "react";
import { PODCAST_PLATFORMS } from "@/lib/audio";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function RssSync() {
  const { user } = useAuth();
  const [feedUrl, setFeedUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadFeed() {
    if (!user) {
      setStatus("Sign in with an active subscription to get your private feed.");
      return;
    }

    setBusy(true);
    setStatus(null);

    try {
      const data = await api.post<{ token: string; feed_url: string }>("/audio/feed/token");
      setFeedUrl(data.feed_url);
      setStatus("Feed ready. Paste it into your podcast app.");
    } catch {
      setStatus("An active subscription is required for the private podcast feed.");
    } finally {
      setBusy(false);
    }
  }

  async function copyFeed() {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setStatus("Feed URL copied.");
    } catch {
      setStatus("Copy failed — select the URL manually.");
    }
  }

  return (
    <div className="border border-hairline-strong bg-ink text-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold">Private RSS &amp; lossless master stream</h2>
          <p className="mt-2 text-white/70 text-sm leading-relaxed">
            Sync Dispatches &amp; Sound to your podcast app with your authenticated token, and stream the
            uncompressed master in your player of choice.
          </p>
        </div>
        <div className="flex gap-3">
          {PODCAST_PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={copyFeed}
              disabled={!feedUrl}
              className="rounded-sm border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition disabled:opacity-40"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <input
          readOnly
          value={feedUrl}
          placeholder={user ? "Generate your authenticated feed token…" : "Sign in to generate your feed token…"}
          className="flex-1 rounded-sm bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 font-mono"
        />
        <button
          onClick={feedUrl ? copyFeed : loadFeed}
          disabled={busy}
          className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold hover:bg-accent-dark transition disabled:opacity-50"
        >
          {busy ? "Preparing…" : feedUrl ? "Copy feed" : "Sync feed"}
        </button>
      </div>

      {status && <p className="mt-3 text-xs text-white/60">{status}</p>}
    </div>
  );
}
