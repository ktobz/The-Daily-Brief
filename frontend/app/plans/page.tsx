"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import type { Plan } from "@/lib/types";

const TIER_CLASS = {
  reader: "Class I",
  audio_master: "Class II",
  terminal: "Class III",
} as const;

const TIER_FLAGSHIP: Record<string, boolean> = {
  audio_master: true,
};

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ data: Plan[] }>("/plans").then((r) => setPlans(r.data)).catch(console.error);
  }, []);

  async function subscribe(plan: Plan) {
    if (!user) {
      router.push("/login");
      return;
    }
    setBusy(plan.id);
    setError("");
    try {
      const res = await api.post<{ checkout_url: string }>(`/subscribe/${plan.id}`, {
        redirect_url: `${window.location.origin}/account`,
      });
      window.location.assign(res.checkout_url);
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  }

  return (
    <SiteShell showNewsletter={false}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">The Daily Brief</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Membership &amp; Terminal Access</h1>
          <p className="mt-3 text-ink-variant leading-relaxed">
            Three classes of access to independent journalism — from the broadsheet archive to the full macro
            terminal workspace.
          </p>
        </div>

        {error && <p className="text-center text-accent">{error}</p>}

        {/* Tier architecture */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const flagship = TIER_FLAGSHIP[plan.tier ?? ""] ?? false;
            const klass = TIER_CLASS[plan.tier as keyof typeof TIER_CLASS] ?? "Class";
            return (
              <div
                key={plan.id}
                className={`relative border p-8 flex flex-col ${
                  flagship
                    ? "border-accent bg-surface shadow-lg -mt-2 lg:-mt-4"
                    : "border-hairline-strong bg-surface-low"
                }`}
              >
                {flagship && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                    Flagship
                  </span>
                )}
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-variant">
                  {klass} · {plan.name}
                </p>
                <p className="mt-3 font-display text-4xl font-bold">
                  {plan.formatted_price || formatNaira(plan.price)}
                </p>
                <p className="text-sm text-ink-variant">/ {plan.interval}{plan.tier === "terminal" ? " per seat" : ""}</p>
                <p className="mt-4 text-sm text-ink-variant leading-relaxed">{plan.description}</p>

                <ul className="mt-5 space-y-2 text-sm flex-1">
                  {(plan.features ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => subscribe(plan)}
                  disabled={busy === plan.id}
                  className={`mt-8 rounded-sm py-3 font-semibold transition disabled:opacity-50 ${
                    flagship
                      ? "bg-accent text-white hover:bg-accent-dark"
                      : "border border-hairline-strong text-ink hover:bg-surface-container"
                  }`}
                >
                  {busy === plan.id ? "Redirecting…" : flagship ? "Subscribe now" : "Select plan"}
                </button>
              </div>
            );
          })}
        </div>

        {plans.length === 0 && <p className="text-center text-ink-variant">No plans available yet.</p>}

        {/* Audio token & specification matrix */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-5">Audio token &amp; specification matrix</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border border-hairline-strong bg-surface-low p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-variant mb-3">
                Private authenticated podcast feed
              </p>
              <div className="rounded-sm bg-ink text-white font-mono text-xs px-3 py-2.5 break-all">
                {API_URL}/audio/feed/{user ? "••••••••••••" : "token-required"}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-variant">
                <span className="rounded-sm bg-accent/10 text-accent font-bold px-2 py-0.5 uppercase tracking-wide">
                  Chapter-supported FLAC
                </span>
                <span>24-Bit · 96kHz · lossless</span>
              </div>
            </div>

            <div className="border border-hairline-strong bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline-strong bg-surface-low text-left">
                    <th className="px-4 py-2 font-semibold">Resolution</th>
                    <th className="px-4 py-2 font-semibold">Bitrate</th>
                    <th className="px-4 py-2 font-semibold">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-hairline">
                    <td className="px-4 py-2">AAC</td>
                    <td className="px-4 py-2">128 kbps</td>
                    <td className="px-4 py-2">Digital Reader</td>
                  </tr>
                  <tr className="border-b border-hairline">
                    <td className="px-4 py-2">MP3</td>
                    <td className="px-4 py-2">320 kbps</td>
                    <td className="px-4 py-2">Digital Reader</td>
                  </tr>
                  <tr className="border-b border-hairline">
                    <td className="px-4 py-2 font-semibold">FLAC</td>
                    <td className="px-4 py-2 font-semibold">Lossless</td>
                    <td className="px-4 py-2 font-semibold text-accent">Audio &amp; Master</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">WAV master</td>
                    <td className="px-4 py-2">96kHz / 24-bit</td>
                    <td className="px-4 py-2">Audio &amp; Master</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Settlement & provisioning */}
        <section className="border border-hairline-strong bg-surface-low p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold">Settlement &amp; provisioning</h2>
              <p className="mt-2 text-sm text-ink-variant leading-relaxed">
                Secure card checkout and corporate invoicing (Class III). Accounts are provisioned automatically on
                confirmation. All transactions are settled over 256-bit TLS.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-variant">
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-hairline-strong px-3 py-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                256-bit TLS
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-hairline-strong px-3 py-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Institutional trust charter
              </span>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
