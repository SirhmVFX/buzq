"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { authErrorMessage, useAuth } from "@/lib/auth-context";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await resetPassword(email);
      setDone(true);
    } catch (err) {
      setError(authErrorMessage(err));
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4" style={{ background: "var(--mkt-bg)" }}>
      <div className="w-full max-w-md rounded-2xl border p-8" style={{ background: "var(--mkt-card)", borderColor: "var(--border)" }}>
        <Logo className="mb-6 text-2xl" />
        <h1 className="font-display text-2xl font-semibold">Reset password</h1>
        {done ? (
          <p className="mt-3 text-sm">Check your inbox for a reset link.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            {error && <p className="text-sm text-[#d7263d]">{error}</p>}
            <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <button className="w-full rounded-lg bg-[#d7263d] py-2.5 font-bold text-white">Send link</button>
          </form>
        )}
        <Link href="/login" className="mt-4 inline-block text-sm font-bold text-[#d7263d]">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
