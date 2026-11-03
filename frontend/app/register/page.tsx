"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell showChrome={false} showNewsletter={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="block text-center font-display text-3xl font-bold text-ink mb-8">
            The Daily <span className="text-accent">Brief</span>
          </Link>
          <h1 className="font-display text-2xl font-bold mb-6">Create your account</h1>

          {error && <p className="mb-4 rounded-sm bg-accent/10 text-accent px-3 py-2 text-sm">{error}</p>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-hairline-strong bg-surface-low px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-hairline-strong bg-surface-low px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-hairline-strong bg-surface-low px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
              <p className="mt-1 text-xs text-ink-variant">At least 8 characters.</p>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-accent py-2.5 font-semibold text-white hover:bg-accent-dark transition disabled:opacity-50"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-variant">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
