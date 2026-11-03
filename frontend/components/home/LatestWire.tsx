import Link from "next/link";
import type { WireItem } from "@/lib/types";
import { timeAgo, formatTime } from "@/lib/format";

export default function LatestWire({ items }: { items: WireItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border border-hairline-strong bg-surface-low">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline-strong">
        <h2 className="font-display font-bold text-sm uppercase tracking-[0.15em]">Latest Wire</h2>
        <span className="text-[10px] text-ink-variant uppercase tracking-wider">Live</span>
      </div>
      <ul className="divide-y divide-hairline">
        {items.slice(0, 8).map((item) => (
          <li key={item.id}>
            <Link
              href={`/article/${item.slug}`}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-container transition"
            >
              <span className="text-[11px] font-mono text-accent whitespace-nowrap mt-0.5">
                {formatTime(item.published_at)}
              </span>
              <span className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-variant">
                  {item.category}
                </span>
                <span className="block font-serif text-[15px] font-semibold leading-snug text-ink line-clamp-2">
                  {item.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
