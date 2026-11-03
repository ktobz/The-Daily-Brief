import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function Masthead() {
  return (
    <header className="border-b border-hairline-strong bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-center">
        <Link href="/" className="inline-block">
          <span className="block font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-none">
            The Daily <span className="text-accent">Brief</span>
          </span>
          <span className="mt-2 block text-[10px] sm:text-xs uppercase tracking-[0.35em] text-ink-variant">
            {SITE_TAGLINE}
          </span>
        </Link>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-hairline-strong" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink-variant">Est. 2026</span>
          <span className="h-px w-16 bg-hairline-strong" />
        </div>
      </div>
    </header>
  );
}
