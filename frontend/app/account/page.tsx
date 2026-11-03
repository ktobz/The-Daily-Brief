"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatNaira, formatDate } from "@/lib/format";
import { enablePush } from "@/lib/firebase";

interface AccountData {
  user: { id: number; name: string; email: string; role: string; avatar?: string | null };
  subscription: { plan: string; status: string; starts_at?: string; ends_at?: string } | null;
  transactions: { reference: string; amount: number; currency: string; status: string; created_at: string }[];
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AccountData | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get<AccountData>("/account").then(setData).catch(console.error);
  }, [user]);

  if (loading) {
    return <SiteShell showNewsletter={false}><div className="mx-auto max-w-4xl px-4 py-16">Loading…</div></SiteShell>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  async function onEnablePush() {
    const ok = await enablePush();
    setPushEnabled(ok);
  }

  return (
    <SiteShell showNewsletter={false}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
        <h1 className="font-display text-3xl font-bold">Your account</h1>

        <div className="border border-hairline-strong bg-surface-low p-6">
          <h2 className="font-semibold mb-3">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-accent text-white flex items-center justify-center font-display text-xl font-bold">
              {user.name[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-ink">{user.name}</p>
              <p className="text-sm text-ink-variant">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="border border-hairline-strong bg-surface-low p-6">
          <h2 className="font-semibold mb-3">Subscription</h2>
          {data?.subscription ? (
            <div>
              <p className="text-ink">
                <span className="font-semibold">{data.subscription.plan}</span> ·{" "}
                <span className="text-accent font-semibold uppercase text-sm">{data.subscription.status}</span>
              </p>
              {data.subscription.ends_at && (
                <p className="mt-1 text-sm text-ink-variant">Renews {formatDate(data.subscription.ends_at)}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-ink-variant">No active subscription.</p>
              <Link href="/plans" className="text-accent font-semibold hover:underline">View plans →</Link>
            </div>
          )}
        </div>

        <div className="border border-hairline-strong bg-surface-low p-6">
          <h2 className="font-semibold mb-3">Notifications</h2>
          <button
            onClick={onEnablePush}
            className="rounded-sm border border-hairline-strong px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent transition"
          >
            {pushEnabled ? "Notifications enabled ✓" : "Enable breaking-news alerts"}
          </button>
        </div>

        {data?.transactions && data.transactions.length > 0 && (
          <div className="border border-hairline-strong bg-surface-low p-6">
            <h2 className="font-semibold mb-3">Billing history</h2>
            <ul className="divide-y divide-hairline">
              {data.transactions.map((t) => (
                <li key={t.reference} className="py-2 flex items-center justify-between text-sm">
                  <span className="text-ink-variant font-mono text-xs">{t.reference}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-ink">{formatNaira(t.amount)}</span>
                    <span className="uppercase text-xs text-ink-variant">{t.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="rounded-sm border border-hairline-strong px-5 py-2.5 text-sm font-semibold text-accent hover:bg-surface-container transition"
        >
          Sign out
        </button>
      </div>
    </SiteShell>
  );
}
