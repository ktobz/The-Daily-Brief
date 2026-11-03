import Link from "next/link";
import { audioSeries } from "@/lib/audio";

export default function SeriesVault() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-bold">Investigative Audio &amp; Archival Vault</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {audioSeries.map((series) => (
          <Link
            key={series.id}
            href="#"
            className="group border border-hairline-strong bg-surface overflow-hidden hover:border-accent transition"
          >
            <div className="overflow-hidden aspect-[16/10] bg-surface-container relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={series.image} alt={series.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              {series.exclusive && (
                <span className="absolute top-3 left-3 rounded-sm bg-ink/85 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1">
                  Subscriber vault
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                {series.episodes} episodes
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold text-ink group-hover:text-accent transition">
                {series.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-variant leading-relaxed">{series.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
