"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { acceptInvite, getInviteByToken } from "@/lib/db";
import type { Invite } from "@/lib/types";

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [invite, setInvite] = useState<(Invite & { id: string }) | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getInviteByToken(params.token).then((inv) => {
      if (!inv) setError("This invite is invalid or expired.");
      else setInvite(inv);
    });
  }, [params.token]);

  async function join() {
    if (!invite || !user) return;
    setBusy(true);
    try {
      await acceptInvite(invite, user);
      router.replace(`/workspace/${invite.workspaceSlug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4" style={{ background: "var(--mkt-bg)" }}>
      <div className="w-full max-w-md rounded-2xl border p-8 text-center" style={{ background: "var(--mkt-card)", borderColor: "var(--border)" }}>
        <Logo className="mb-6 justify-center text-2xl" />
        {error && <p className="text-[#d7263d]">{error}</p>}
        {invite && (
          <>
            <h1 className="font-display text-2xl font-semibold">Join {invite.workspaceName}</h1>
            <p className="mt-2 text-sm text-[var(--mkt-muted)]">You’ll land in the same Slack-like channels as the rest of the team.</p>
            {loading ? null : user ? (
              <button disabled={busy} onClick={() => void join()} className="mt-6 w-full rounded-lg bg-[#d7263d] py-2.5 font-bold text-white">
                {busy ? "Joining…" : "Join workspace"}
              </button>
            ) : (
              <a
                href={`/signup?next=/invite/${params.token}`}
                className="mt-6 inline-block w-full rounded-lg bg-[#d7263d] py-2.5 font-bold text-white"
              >
                Create an account to join
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
