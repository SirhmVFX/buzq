"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { CtaBand } from "./cta-band";
import { MarketingFooter } from "./footer";
import { MarketingNav } from "./nav";

export function MarketingShell({
  children,
  cta = true,
}: {
  children: React.ReactNode;
  cta?: boolean;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--mkt-bg)", color: "var(--mkt-ink)" }}>
      <div className="h-1 w-full bg-[#d7263d]" />
      <MarketingNav />
      {children}
      {cta && <CtaBand />}
      <MarketingFooter />
      <Link
        href="/help"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#d7263d] px-4 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(215,38,61,0.4)] transition hover:scale-[1.04]"
      >
        <Bot className="h-4 w-4" /> Ask Buzq
      </Link>
    </div>
  );
}

export function PageHero({
  kicker,
  title,
  lede,
}: {
  kicker?: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-20">
      <div className="absolute inset-0 lp-grid pointer-events-none" />
      <div className="relative mx-auto max-w-3xl text-center">
        {kicker && (
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#d7263d]">{kicker}</p>
        )}
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--mkt-muted)]">{lede}</p>
      </div>
    </section>
  );
}
