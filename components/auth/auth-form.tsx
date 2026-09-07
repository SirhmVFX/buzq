"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { authErrorMessage, useAuth } from "@/lib/auth-context";
import { listenUserWorkspaces } from "@/lib/db";

function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { login, signup, loginWithGoogle, configured } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function goHome(uid: string) {
    if (next) {
      router.replace(next);
      return;
    }
    const unsub = listenUserWorkspaces(uid, (items) => {
      unsub();
      if (items[0]) router.replace(`/workspace/${items[0].slug}`);
      else router.replace("/onboarding");
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const profile =
        mode === "signup"
          ? await signup({ email, password, displayName: displayName || email.split("@")[0] })
          : await login(email, password);
      await goHome(profile.id);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: "var(--mkt-bg)", color: "var(--mkt-ink)" }}>
      <Logo className="mb-8 text-2xl" />
      <div className="w-full max-w-md rounded-2xl border p-8 shadow-sm" style={{ background: "var(--mkt-card)", borderColor: "var(--border)" }}>
        <h1 className="font-display text-2xl font-semibold">{mode === "login" ? "Sign in to Buzq" : "Create your Buzq account"}</h1>
        <p className="mt-1 text-sm text-[var(--mkt-muted)]">
          {mode === "login" ? "Jump back into your product pulse." : "Your team’s ops chat, ready in a minute."}
        </p>
        {!configured && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Firebase is not configured yet. Add keys to <code>.env.local</code> — see the README.
          </p>
        )}
        {error && <p className="mt-4 text-sm text-[#d7263d]">{error}</p>}
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input className="field" placeholder="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          )}
          <input className="field" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={busy} className="w-full rounded-lg bg-[#d7263d] py-2.5 font-bold text-white">
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={async () => {
            try {
              const profile = await loginWithGoogle();
              await goHome(profile.id);
            } catch (err) {
              setError(authErrorMessage(err));
            }
          }}
          className="mt-3 w-full rounded-lg border py-2.5 font-bold"
          style={{ borderColor: "var(--border)" }}
        >
          Continue with Google
        </button>
        <p className="mt-5 text-center text-sm text-[var(--mkt-muted)]">
          {mode === "login" ? (
            <>
              New here? <Link href="/signup" className="font-bold text-[#d7263d]">Create an account</Link>
              <br />
              <Link href="/forgot-password" className="text-[13px]">Forgot password?</Link>
            </>
          ) : (
            <>
              Already have an account? <Link href="/login" className="font-bold text-[#d7263d]">Sign in</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}

export function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
