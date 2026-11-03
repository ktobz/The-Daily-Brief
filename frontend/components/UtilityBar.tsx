"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EDITIONS, MARKET_INDICATORS } from "@/lib/constants";
import { useAuth } from "@/lib/auth";

export default function UtilityBar({ edition = "Lagos" }: { edition?: string }) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateStr(
      new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  function select(e: string) {
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `edition=${e}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.replace("/");
    router.refresh();
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="bg-ink text-white text-[11px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-white/60 whitespace-nowrap">{dateStr}</span>
          <span className="hidden sm:inline text-white/25">|</span>
          <div className="hidden sm:flex items-center gap-1">
            {EDITIONS.map((e) => (
              <button
                key={e}
                onClick={() => select(e)}
                className={`px-1.5 py-0.5 rounded-sm transition ${
                  edition === e ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 overflow-hidden">
          {MARKET_INDICATORS.map((m) => (
            <span key={m.symbol} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-white/50">{m.symbol}</span>
              <span className="text-white">{m.value}</span>
              <span className={m.isPositive ? "text-emerald-400" : "text-red-400"}>{m.change}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 whitespace-nowrap">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/account" className="text-white/80 hover:text-white font-semibold">
                    {user.name.split(" ")[0]}
                  </Link>
                  <button onClick={handleLogout} className="text-white/50 hover:text-white">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white/80 hover:text-white font-semibold">
                    Sign in
                  </Link>
                  <Link
                    href="/plans"
                    className="rounded-sm bg-white text-ink px-2.5 py-0.5 font-semibold hover:bg-white/90 transition"
                  >
                    Subscribe
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
