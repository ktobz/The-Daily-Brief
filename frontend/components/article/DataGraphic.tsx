import type { DataGraphic as DataGraphicType } from "@/lib/types";

function linePath(values: number[], w: number, h: number, pad: number): string {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / Math.max(values.length - 1, 1);
  return values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (h - pad * 2) * (1 - (v - min) / range);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function DataGraphic({ data }: { data: DataGraphicType | null | undefined }) {
  if (!data || !data.series || data.series.length === 0) return null;

  const w = 640;
  const h = 220;
  const pad = 28;
  const colors = ["#b91c1c", "#1a1a1a", "#5a5855"];

  return (
    <figure className="my-8 border border-hairline-strong bg-surface-low p-5">
      <figcaption className="mb-3">
        {data.title && <p className="font-display font-bold text-ink">{data.title}</p>}
        {data.subtitle && <p className="text-xs text-ink-variant mt-0.5">{data.subtitle}</p>}
      </figcaption>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={data.title || "Chart"}>
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
        {data.series.map((s, i) => (
          <path
            key={s.name}
            d={linePath(s.data, w, h, pad)}
            fill="none"
            stroke={s.color || colors[i % colors.length]}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {data.xAxis && (
        <div className="flex justify-between mt-1 text-[10px] text-ink-variant">
          {data.xAxis.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-3">
        {data.series.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1.5 text-xs text-ink-variant">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: s.color || colors[i % colors.length] }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </figure>
  );
}
