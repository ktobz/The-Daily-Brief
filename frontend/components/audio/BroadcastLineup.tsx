import { broadcastLineup } from "@/lib/audio";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  listened: { label: "Listened", cls: "bg-surface-container text-ink-variant" },
  top: { label: "Top Stream", cls: "bg-accent text-white" },
  new: { label: "Field Audio", cls: "bg-emerald-600 text-white" },
  scheduled: { label: "Scheduled", cls: "bg-ink/5 text-ink-variant" },
};

export default function BroadcastLineup() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-bold">Daily Broadcast Lineup</h2>
        <span className="text-xs text-ink-variant uppercase tracking-wider">Audio wire queue</span>
      </div>
      <div className="border border-hairline-strong bg-surface divide-y divide-hairline">
        {broadcastLineup.map((slot) => {
          const meta = STATUS_META[slot.status];
          return (
            <div key={slot.time} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-low transition">
              <span className="font-mono text-sm text-accent tabular-nums w-12">{slot.time}</span>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-semibold text-ink">{slot.title}</p>
                <p className="text-xs text-ink-variant">{slot.duration}</p>
              </div>
              <span className={`shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.cls}`}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
