"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon, MenuIcon } from "./icons";

const TABS = [
  { label: "Stories", href: "/", icon: <span className="font-display font-bold text-sm">B</span>, exact: true },
  { label: "Wire", href: "/wire", icon: <span className="font-display font-bold text-sm">W</span> },
  { label: "Opinion", href: "/category/opinion", icon: <span className="font-display font-bold text-sm">O</span> },
  { label: "Saved", href: "/saved", icon: <BookmarkIcon className="h-5 w-5" /> },
  { label: "Sections", href: "/sections", icon: <MenuIcon className="h-5 w-5" /> },
];

export default function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-hairline-strong pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                active ? "text-accent" : "text-ink-variant"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
