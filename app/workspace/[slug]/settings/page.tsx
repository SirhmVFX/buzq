"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createApiKey, listenApiKeys, revokeApiKey } from "@/lib/db";
import { useWorkspace } from "@/lib/workspace-context";
import type { ApiKeyRecord } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

export default function SettingsPage() {
  const params = useParams<{ slug: string }>();
  const { uid } = useAuth();
  const { workspace } = useWorkspace();
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [name, setName] = useState("Production");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!workspace) return;
    return listenApiKeys(workspace.id, setKeys);
  }, [workspace]);

  if (!workspace) return null;

  const ingestUrl = `${typeof window !== "undefined" ? window.location.origin : siteUrl()}/api/v1/events`;
  const snippet = `await fetch("${ingestUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${revealed || "bzq_live_YOUR_KEY"}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    channel: "payments",
    status: "error", // or "success"
    event: "payment.failed",
    title: "Payment failed",
    message: "Card declined for jane@acme.com — $49.00",
    metadata: { amount: 4900, userId: "u_123" }
  })
})`;

  return (
    <div className="min-h-screen" style={{ background: "var(--main-bg)", color: "var(--main-text)" }}>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href={`/workspace/${params.slug}`} className="text-sm font-bold text-[#d7263d]">
          ← Back to {workspace.name}
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">Workspace settings</h1>
        <p className="mt-1 text-[var(--main-muted)]">API keys, ingest snippet, and how events land in channels.</p>

        <section className="mt-10">
          <h2 className="text-xl font-black">API keys</h2>
          <p className="mt-1 text-sm text-[var(--main-muted)]">
            Put one of these in the success and unsuccessful code blocks of your product. We only show the full key once.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!uid) return;
              setBusy(true);
              try {
                const key = await createApiKey(workspace.id, name || "Untitled", uid);
                setRevealed(key);
              } finally {
                setBusy(false);
              }
            }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} className="field max-w-xs" />
            <button disabled={busy} className="rounded-md bg-[#d7263d] px-4 font-bold text-white">
              Create key
            </button>
          </form>
          {revealed && (
            <div className="mt-3 rounded-lg border border-[#2eb67d] p-3">
              <p className="text-xs font-bold text-[#2eb67d]">Copy this now — it will not be shown again</p>
              <code className="mt-1 block break-all font-mono text-sm">{revealed}</code>
            </div>
          )}
          <ul className="mt-4 divide-y" style={{ borderColor: "var(--border)" }}>
            {keys.map((k) => (
              <li key={k.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold">{k.name}</p>
                  <p className="font-mono text-xs text-[var(--main-muted)]">{k.prefix}…</p>
                </div>
                <button
                  className="text-sm text-[#e01e5a]"
                  onClick={() => void revokeApiKey(workspace.id, k.id, k.keyHash)}
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-black">Drop this in success / fail blocks</h2>
          <p className="mt-1 text-sm text-[var(--main-muted)]">
            Channel names match your Slack-like channels: <code>signups</code>, <code>payments</code>, <code>errors</code>,{" "}
            <code>deployments</code>, or any channel you create.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl p-4 font-mono text-[12.5px] leading-6" style={{ background: "var(--hover)" }}>
            {snippet}
          </pre>
        </section>
      </div>
    </div>
  );
}
