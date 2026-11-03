import type { YieldPoint } from "@/lib/markets";

function path(points: YieldPoint[], w: number, h: number, pad: number): string {
  if (points.length === 0) return "";
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / Math.max(points.length - 1, 1);
  return points
    .map((p, i) => {
      const x = pad + i * stepX;
      const y = pad + (h - pad * 2) * (1 - (p.value - min) / range);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function YieldCurveChart({
  series,
  title,
}: {
  series: { name: string; color: string; points: YieldPoint[] }[];
  title: string;
}) {
  const w = 640;
  const h = 240;
  const pad = 34;
  const tenors = series[0]?.points.map((p) => p.tenor) ?? [];

  return (
    <figure className="border border-hairline-strong bg-surface-low p-5">
      <figcaption className="mb-3">
        <p className="font-display font-bold text-ink">{title}</p>
        <p className="text-xs text-ink-variant mt-0.5">Yield (%) by tenor</p>
      </figcaption>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={title}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={w - pad}
            y1={pad + (h - pad * 2) * f}
            y2={pad + (h - pad * 2) * f}
            stroke="#e5e1da"
            strokeWidth={1}
          />
        ))}
        {series.map((s) => (
          <path
            key={s.name}
            d={path(s.points, w, h, pad)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {tenors.map((t, i) => {
          const x = pad + (i * (w - pad * 2)) / Math.max(tenors.length - 1, 1);
          return (
            <text key={t} x={x} y={h - 8} textAnchor="middle" className="fill-ink-variant" fontSize={10}>
              {t}
            </text>
          );
        })}
      </svg>

      <div className="flex gap-4 mt-2">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-xs text-ink-variant">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </figure>
  );
}
