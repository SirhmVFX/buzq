"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { createInvite, createWorkspace, listenUserWorkspaces } from "@/lib/db";
import { DEFAULT_CHANNELS, slugify } from "@/lib/utils";

const STEPS = ["Welcome", "Workspace", "URL", "Channels", "Invite", "API key", "Ready"];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [channels, setChannels] = useState<string[]>(["general", "signups", "payments", "errors"]);
  const [emails, setEmails] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [workspaceSlug, setWorkspaceSlug] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/signup");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || apiKey || creatingNew || step > 0) return;
    return listenUserWorkspaces(user.id, (items) => {
      if (items[0]) router.replace(`/workspace/${items[0].slug}`);
    });
  }, [user, apiKey, creatingNew, step, router]);

  const previewSlug = useMemo(() => slugify(slug || name || "workspace"), [slug, name]);

  async function create(e?: FormEvent) {
    e?.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const res = await createWorkspace({
        name: name.trim() || "My workspace",
        owner: user,
        slug: previewSlug,
        channelNames: channels,
      });
      setApiKey(res.apiKey);
      setWorkspaceSlug(res.workspace.slug);
      setWorkspaceId(res.workspace.id);
      const list = emails
        .split(/[, \n]+/)
        .map((x) => x.trim().toLowerCase())
        .filter((x) => x.includes("@"));
      await Promise.all(
        list.map((email) =>
          createInvite({
            workspaceId: res.workspace.id,
            workspaceName: res.workspace.name,
            workspaceSlug: res.workspace.slug,
            createdBy: user.id,
            email,
          })
        )
      );
      setStep(5);
    } finally {
      setBusy(false);
    }
  }

  const snippet = `await fetch("${typeof window !== "undefined" ? window.location.origin : ""}/api/v1/events", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${apiKey || "bzq_live_…"}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    channel: "signups",
    status: "success",
    event: "user.signup",
    title: "New user signed up",
    message: "ada@lumen.dev created an account",
  }),
})`;

  return (
    <div className="min-h-screen" style={{ background: "var(--mkt-bg)", color: "var(--mkt-ink)" }}>
      <div className="h-1 w-full bg-[#d7263d]" />
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <Logo className="text-lg" />
        <p className="text-sm text-[var(--mkt-muted)]">
          Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </p>
      </div>
      <div className="mx-auto mb-8 flex max-w-3xl gap-1 px-4">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[#d7263d]" : "bg-black/10 dark:bg-white/10"}`} />
        ))}
      </div>

      <div className="mx-auto max-w-lg px-4 pb-16">
        <div className="mega-in rounded-2xl border p-8" style={{ background: "var(--mkt-card)", borderColor: "var(--border)" }}>
          {step === 0 && (
            <>
              <h1 className="font-display text-3xl font-semibold">Welcome to Buzq</h1>
              <p className="mt-3 text-[var(--mkt-muted)]">
                We’ll create a Slack-like workspace for your product’s pulse: channels for signups, payments, errors, then an API key for success and fail blocks.
              </p>
              <button
                className="slack-btn-primary mt-8 w-full py-3"
                onClick={() => {
                  setCreatingNew(true);
                  setStep(1);
                }}
              >
                Create a workspace
              </button>
            </>
          )}

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSlug(slugify(name));
                setStep(2);
              }}
            >
              <h1 className="font-display text-3xl font-semibold">What’s the name of your company?</h1>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">This is how the workspace appears in the sidebar.</p>
              <input required className="field mt-6" placeholder="Lumen" value={name} onChange={(e) => setName(e.target.value)} />
              <button className="slack-btn-primary mt-6 w-full py-3">Next</button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
            >
              <h1 className="font-display text-3xl font-semibold">Choose a Buzq URL</h1>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">You can change the display name later. The slug is in the address bar.</p>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm text-[var(--mkt-muted)]">buzq.app/workspace/</span>
                <input className="field" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
              <p className="mt-2 text-xs text-[var(--mkt-muted)]">Preview: /workspace/{previewSlug}</p>
              <button className="slack-btn-primary mt-6 w-full py-3">Next</button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(4);
              }}
            >
              <h1 className="font-display text-3xl font-semibold">What should we watch?</h1>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">We’ll create these channels. You can add more later.</p>
              <ul className="mt-6 space-y-2">
                {DEFAULT_CHANNELS.map((ch) => {
                  const on = channels.includes(ch.name);
                  return (
                    <li key={ch.name}>
                      <button
                        type="button"
                        onClick={() =>
                          setChannels((prev) =>
                            ch.name === "general"
                              ? prev
                              : on
                                ? prev.filter((x) => x !== ch.name)
                                : [...prev, ch.name]
                          )
                        }
                        className="flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left"
                        style={{ borderColor: on ? "#d7263d" : "var(--border)", background: on ? "var(--brand-soft)" : "transparent" }}
                      >
                        <span className="mt-0.5 grid h-5 w-5 place-items-center rounded border" style={{ borderColor: on ? "#d7263d" : "var(--border)" }}>
                          {on && <Check className="h-3.5 w-3.5 text-[#d7263d]" />}
                        </span>
                        <span>
                          <span className="font-bold">#{ch.name}</span>
                          <span className="mt-0.5 block text-sm text-[var(--mkt-muted)]">{ch.topic}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button className="slack-btn-primary mt-6 w-full py-3">Next</button>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={(e) => void create(e)}>
              <h1 className="font-display text-3xl font-semibold">Who else is on the team?</h1>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">Optional. Paste emails — we’ll mint invite links for each.</p>
              <textarea
                className="field mt-6 min-h-28"
                placeholder="ada@lumen.dev, sam@lumen.dev"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
              <button disabled={busy} className="slack-btn-primary mt-6 w-full py-3">
                {busy ? "Creating workspace…" : "Create workspace"}
              </button>
            </form>
          )}

          {step === 5 && apiKey && (
            <>
              <h1 className="font-display text-3xl font-semibold">Your first API key</h1>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">Copy it now. We won’t show the full key again. Drop it into success and fail blocks.</p>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--hover)] p-3">
                <code className="flex-1 break-all font-mono text-sm">{apiKey}</code>
                <button
                  className="grid h-8 w-8 place-items-center rounded-md hover:bg-black/5"
                  onClick={() => {
                    void navigator.clipboard.writeText(apiKey);
                    setCopied(true);
                  }}
                >
                  {copied ? <Check className="h-4 w-4 text-[#2eb67d]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-xl p-3 font-mono text-[11px] leading-5" style={{ background: "#1a1214", color: "#f6ecee" }}>
                {snippet}
              </pre>
              <button className="slack-btn-primary mt-6 w-full py-3" onClick={() => setStep(6)}>
                I’ve copied the key
              </button>
            </>
          )}

          {step === 6 && (
            <>
              <h1 className="font-display text-3xl font-semibold">You’re in.</h1>
              <p className="mt-3 text-[var(--mkt-muted)]">
                {name} is live. Open #{channels.includes("signups") ? "signups" : "general"} and send a test success or fail from the header — then react and reply in the thread.
              </p>
              <button
                className="slack-btn-primary mt-8 w-full py-3"
                onClick={() => router.push(`/workspace/${workspaceSlug}${workspaceId ? "" : ""}`)}
              >
                Open workspace
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
