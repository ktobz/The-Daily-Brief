"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_CATEGORIES } from "@/lib/constants";
import { MenuIcon, SearchIcon } from "./icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <nav className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-hairline-strong">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center h-11">
          <button
            className="lg:hidden p-1 -ml-1 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold tracking-wide text-ink">
            {NAV_CATEGORIES.map((c) => (
              <Link key={c} href={`/category/${c.toLowerCase()}`} className="hover:text-accent transition">
                {c}
              </Link>
            ))}
            <Link href="/markets" className="hover:text-accent transition">
              Markets &amp; Macro
            </Link>
            <Link href="/audio" className="text-accent hover:text-accent-dark transition">
              Audio &amp; Briefings
            </Link>
          </div>

          <form
            className="ml-auto flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-28 sm:w-48 rounded-sm border border-hairline-strong bg-surface-low px-2.5 py-1.5 text-sm focus:outline-none focus:border-accent"
            />
            <button type="submit" className="text-ink-variant hover:text-accent" aria-label="Search">
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-hairline-strong bg-surface px-4 py-3">
          <div className="grid grid-cols-2 gap-1">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/category/${c.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium hover:text-accent"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/audio"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-accent"
            >
              Audio &amp; Briefings
            </Link>
            <Link
              href="/markets"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-accent"
            >
              Markets &amp; Macro
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
