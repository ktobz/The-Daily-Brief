"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/newsletter", { email });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section className="bg-accent-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">The Evening Brief</p>
          <h2 className="mt-2 font-display text-3xl font-bold">The news you need, by 6pm.</h2>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            One considered briefing of the day&apos;s events, delivered to your inbox every evening.
          </p>
        </div>
        {done ? (
          <p className="font-display text-xl">Thank you — you&apos;re subscribed.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-sm border border-white/25 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="rounded-sm bg-white text-accent-dark px-6 py-3 font-semibold hover:bg-surface-low transition"
            >
              Subscribe
            </button>
          </form>
        )}
        {error && <p className="text-red-200 text-sm">{error}</p>}
      </div>
    </section>
  );
}
