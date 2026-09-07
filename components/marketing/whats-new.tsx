"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS = [
  {
    badge: "New feature",
    title: "Threads on every event",
    body: "A failed payment becomes an incident room. Reply without leaving the stream.",
    href: "/features",
  },
  {
    badge: "New feature",
    title: "Slack-style reactions",
    body: "👍 👀 🚨 on any card or chat message — including DMs.",
    href: "/features",
  },
  {
    badge: "New feature",
    title: "Invite the whole company",
    body: "Workspace links, private channels, and a rail that switches products.",
    href: "/docs/invites",
  },
  {
    badge: "Enhancement",
    title: "Ingest in one POST",
    body: "Success and fail blocks share a body. Only status changes.",
    href: "/docs/api",
  },
];

export function WhatsNew() {
  const [i, setI] = useState(0);
  const visible = CARDS.slice(i, i + 3);
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-4xl font-semibold tracking-tight">What’s new in Buzq</h2>
        <Link href="/changelog" className="font-bold text-[#d7263d] hover:underline">
          See all updates →
        </Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {visible.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group overflow-hidden rounded-2xl border bg-[var(--mkt-card)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(215,38,61,0.12)]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="h-36 bg-gradient-to-br from-[#d7263d] to-[#6e1422] p-4">
              <div className="h-full rounded-xl bg-white/10 ring-1 ring-white/20" />
            </div>
            <div className="p-5">
              <span className="rounded-full bg-[#d7263d]/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-[#d7263d]">
                {c.badge}
              </span>
              <h3 className="mt-3 text-xl font-black group-hover:text-[#d7263d]">{c.title}</h3>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">{c.body}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        <button
          className="grid h-10 w-10 place-items-center rounded-full border transition hover:bg-[var(--hover)]"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-full border transition hover:bg-[var(--hover)]"
          onClick={() => setI((v) => Math.min(CARDS.length - 3, v + 1))}
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
