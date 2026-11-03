"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/constants";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
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
          <h1 className="font-display text-2xl font-bold mb-6">Sign in</h1>

          {error && <p className="mb-4 rounded-sm bg-accent/10 text-accent px-3 py-2 text-sm">{error}</p>}

          <form onSubmit={submit} className="space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-hairline-strong bg-surface-low px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-accent py-2.5 font-semibold text-white hover:bg-accent-dark transition disabled:opacity-50"
            >
              Sign in
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-variant">
            <span className="h-px flex-1 bg-hairline-strong" /> or <span className="h-px flex-1 bg-hairline-strong" />
          </div>

          <a
            href={`${API_URL}/auth/google/redirect`}
            className="flex items-center justify-center gap-2 w-full rounded-sm border border-hairline-strong bg-white py-2.5 font-semibold text-ink hover:bg-surface-low transition"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.72.12-1.42.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
            </svg>
            Continue with Google
          </a>

          <p className="mt-6 text-center text-sm text-ink-variant">
            New to The Daily Brief?{" "}
            <Link href="/register" className="font-semibold text-accent hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
