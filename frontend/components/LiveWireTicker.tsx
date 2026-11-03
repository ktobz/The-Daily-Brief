import Link from "next/link";
import type { WireItem } from "@/lib/types";
import { timeAgo } from "@/lib/format";

export default function LiveWireTicker({ items }: { items: WireItem[] }) {
  if (!items || items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="bg-accent text-white">
      <div className="flex items-center h-9">
        <span className="shrink-0 z-10 bg-accent-dark px-3 h-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          Live Wire
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-marquee whitespace-nowrap inline-flex">
            {doubled.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={`/article/${item.slug}`}
                className="inline-flex items-center mx-5 text-[13px] hover:underline"
              >
                <span className="text-white/60 mr-2">{item.category}</span>
                <span className="font-medium">{item.title}</span>
                <span className="text-white/60 ml-2">{timeAgo(item.published_at)}</span>
                <span className="mx-5 text-white/40">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
