"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Login failed (${res.status})`);
      }

      router.replace(next);
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h1 className="text-xl font-extrabold text-slate-900">SMK Trust The Process</h1>
          <p className="mt-1 text-sm text-slate-600">Login to access the dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0f3b34]/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {error ? <div className="mt-3 text-sm text-rose-600">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#0f3b34] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}