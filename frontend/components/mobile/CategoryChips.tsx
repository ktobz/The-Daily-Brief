"use client";

import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/constants";

const CHIPS = ["Top Stories", ...NAV_CATEGORIES, "Markets", "Audio"];

export default function CategoryChips() {
  return (
    <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CHIPS.map((chip) => {
          const href =
            chip === "Top Stories"
              ? "/"
              : chip === "Audio"
                ? "/audio"
                : chip === "Markets"
                  ? "/markets"
                  : `/category/${chip.toLowerCase()}`;
          return (
            <Link
              key={chip}
              href={href}
              className="shrink-0 rounded-full border border-hairline-strong bg-surface-low px-4 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition"
            >
              {chip}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
