import SiteShell from "@/components/SiteShell";
import AudioHubPlayer from "@/components/audio/AudioHubPlayer";
import BroadcastLineup from "@/components/audio/BroadcastLineup";
import SeriesVault from "@/components/audio/SeriesVault";
import RssSync from "@/components/audio/RssSync";
import { API_URL } from "@/lib/constants";

interface ApiBroadcast {
  id: string;
  title: string;
  slug: string;
  episode_number: number;
  dek?: string | null;
  duration_seconds: number;
  tier: string;
  audio_format: string;
  is_live_wire: boolean;
  published_at?: string | null;
}

async function getBroadcasts(): Promise<ApiBroadcast[]> {
  try {
    const res = await fetch(`${API_URL}/audio`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as ApiBroadcast[];
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Dispatches & Sound — The Daily Brief",
  description:
    "The Daily Brief audio hub: daily briefings, investigative series and synchronized transcripts.",
};

export default async function AudioPage() {
  const broadcasts = await getBroadcasts();

  return (
    <SiteShell showNewsletter={false}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-14">
        <header className="border-b border-hairline-strong pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">The Daily Brief</p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-bold">Dispatches &amp; Sound</h1>
          <p className="mt-2 text-ink-variant max-w-2xl">
            Broadcast audio intelligence — morning wires, market open, and investigative series — with
            synchronized, court-reporter certified transcripts.
          </p>
        </header>

        <AudioHubPlayer />

        {broadcasts.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold mb-5">Broadcast archive</h2>
            <div className="border border-hairline-strong bg-surface divide-y divide-hairline">
              {broadcasts.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
                  <span className="font-mono text-xs text-accent tabular-nums w-16">EP.{b.episode_number}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-semibold text-ink">{b.title}</p>
                    {b.dek && <p className="text-xs text-ink-variant line-clamp-1">{b.dek}</p>}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide rounded-sm bg-accent/10 text-accent px-2 py-0.5">
                    {b.audio_format}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-ink-variant">
                    {b.is_live_wire ? "Live wire" : "Master cut"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <BroadcastLineup />
        <SeriesVault />
        <RssSync />
      </div>
    </SiteShell>
  );
}
