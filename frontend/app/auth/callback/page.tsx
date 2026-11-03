"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";

function Callback() {
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      setToken(token);
      window.location.replace("/");
    } else {
      window.location.replace("/login");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display text-lg text-ink-variant">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <Callback />
    </Suspense>
  );
}
