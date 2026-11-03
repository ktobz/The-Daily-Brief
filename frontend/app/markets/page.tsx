import SiteShell from "@/components/SiteShell";
import YieldCurveChart from "@/components/markets/YieldCurveChart";
import {
  globalIndices,
  currencies,
  commodities,
  macroIndicators,
  ngYieldCurve,
  usYieldCurve,
  tone,
} from "@/lib/markets";

export const metadata = {
  title: "Markets & Macro Terminal — The Daily Brief",
  description: "Global indices, currencies, commodities and macro indicators.",
};

export default function MarketsPage() {
  return (
    <SiteShell showNewsletter={false}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
        <header className="border-b border-hairline-strong pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">The Daily Brief</p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-bold">Markets &amp; Macro Terminal</h1>
          <p className="mt-2 text-ink-variant max-w-2xl">
            Live indices, currencies, commodities and macro indicators — data refreshed throughout the session.
          </p>
        </header>

        {/* Indices */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-5">Global indices</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalIndices.map((q) => (
              <div key={q.symbol} className="border border-hairline-strong bg-surface p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-variant">{q.symbol}</span>
                  <span className={`text-sm font-semibold ${tone(q.isPositive)}`}>
                    {q.isPositive ? "▲" : "▼"} {q.changePct}
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums">{q.value}</p>
                <p className="text-xs text-ink-variant">{q.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Yield curves */}
        <section className="grid lg:grid-cols-2 gap-6">
          <YieldCurveChart
            title="Nigerian sovereign curve"
            series={[{ name: "NGN yields", color: "#b91c1c", points: ngYieldCurve }]}
          />
          <YieldCurveChart
            title="US Treasury curve"
            series={[{ name: "US yields", color: "#1a1a1a", points: usYieldCurve }]}
          />
        </section>

        {/* Currencies + commodities */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-5">Currencies</h2>
            <div className="border border-hairline-strong bg-surface divide-y divide-hairline">
              {currencies.map((c) => (
                <div key={c.pair} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-ink">{c.pair}</p>
                    <p className="text-xs text-ink-variant">{c.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums text-ink">{c.rate}</p>
                    <p className={`text-xs font-semibold ${tone(c.isPositive)}`}>{c.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-5">Commodities</h2>
            <div className="border border-hairline-strong bg-surface divide-y divide-hairline">
              {commodities.map((c) => (
                <div key={c.symbol} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-ink">{c.symbol}</p>
                    <p className="text-xs text-ink-variant">{c.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums text-ink">{c.value}</p>
                    <p className={`text-xs font-semibold ${tone(c.isPositive)}`}>{c.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Macro indicators */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-5">Macro indicators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {macroIndicators.map((m) => (
              <div key={m.label} className="border border-hairline-strong bg-surface p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-variant">{m.label}</p>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums text-ink">{m.value}</p>
                <p className={`text-sm font-semibold ${tone(m.isPositive)}`}>{m.change}</p>
                <p className="mt-1 text-xs text-ink-variant">{m.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
