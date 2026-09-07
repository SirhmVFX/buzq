"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/shell";
import { SlackPreview } from "@/components/marketing/slack-preview";
import { WhatsNew } from "@/components/marketing/whats-new";
import { FEATURES, PLANS } from "@/lib/content";

const LOGOS = ["Lumen", "Northstar", "Harbor", "Kite", "Fold", "Vesper", "Orbit", "Nimbus", "Stripe-like", "IBM-ish"];

export default function HomePage() {
  return (
    <MarketingShell cta={false}>
      <div className="border-b bg-[#d7263d] px-4 py-2 text-center text-sm font-bold text-white">
        Threads and Slack-style reactions are here.{" "}
        <Link href="/changelog" className="underline underline-offset-2">
          Learn more
        </Link>
      </div>

      <section className="relative overflow-hidden px-4 pb-8 pt-16 md:pt-24">
        <div className="absolute inset-0 lp-grid pointer-events-none" />
        <div className="absolute inset-0 lp-noise pointer-events-none" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#d7263d]/20 blur-[90px]" />
        <div className="relative mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-[var(--mkt-muted)]" style={{ borderColor: "color-mix(in srgb, var(--brand) 30%, transparent)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#d7263d] live-dot" />
              All your people, watching the product together
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[72px]">
              Know the second
              <br />
              <span className="text-[#d7263d]">something breaks.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--mkt-muted)]">
              Drop an API call into success and unsuccessful code blocks. Events land in channels that look and feel like Slack — threads, reactions, invites, DMs.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="slack-btn-primary px-7 py-3 text-[14px]">
                Get started
              </Link>
              <Link href="/pricing" className="slack-btn-ghost px-7 py-3 text-[14px]">
                Find your plan
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <SlackPreview />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y py-5" style={{ borderColor: "color-mix(in srgb, var(--brand) 12%, transparent)" }}>
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.18em] text-[var(--mkt-muted)]">Trusted by teams who ship</p>
        <div className="flex w-max gap-16 px-8 marquee text-sm font-bold uppercase tracking-[0.2em] text-[var(--mkt-muted)]">
          {[...LOGOS, ...LOGOS].map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </div>
      </div>

      <WhatsNew />

      <section className="mx-auto max-w-[1200px] px-4 py-16">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7263d]">How it works</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight">If the code already knows, the company should too.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Create a workspace", d: "A guided onboarding names the room, picks log channels, and invites the team." },
            { n: "02", t: "Drop in two requests", d: "One in the successful path. One in the unsuccessful path. Same shape, different status." },
            { n: "03", t: "Talk in the stream", d: "React, reply in a thread, chat in the channel, or DM — Slack muscle memory." },
          ].map((s) => (
            <div key={s.n} className="lift-card rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
              <p className="font-mono text-sm text-[#d7263d]">{s.n}</p>
              <h3 className="mt-3 text-xl font-black">{s.t}</h3>
              <p className="mt-2 text-[var(--mkt-muted)]">{s.d}</p>
            </div>
          ))}
        </div>
        <pre className="mt-10 overflow-x-auto rounded-2xl p-6 font-mono text-[13px] leading-7" style={{ background: "#1a1214", color: "#f6ecee" }}>{`try {
  const user = await register(payload)
  await buzq.success("signups", "user.signup", user.email)
} catch (err) {
  await buzq.error("signups", "user.signup_failed", err.message)
  throw err
}`}</pre>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-16">
        <h2 className="font-display text-4xl font-semibold tracking-tight">Built like Slack. Aimed at your product.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="lift-card rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
              <h3 className="font-black">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:grid-cols-3">
        {[
          ["90%", "of founders say they hear about failures too late"],
          ["2", "API calls — success and fail — to instrument a path"],
          ["0", "query languages. If you can use Slack, you can use Buzq"],
        ].map(([n, d]) => (
          <div key={d}>
            <p className="font-display text-5xl font-semibold text-[#d7263d]">{n}</p>
            <p className="mt-2 text-[var(--mkt-muted)]">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-8">
        <h2 className="text-center font-display text-4xl font-semibold">Choose a plan</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--mkt-muted)]">Free to wire the first product. Team when the whole company lives in the stream.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className="lift-card relative flex flex-col rounded-2xl border p-6"
              style={{
                borderColor: p.featured ? "#d7263d" : "var(--border)",
                background: "var(--mkt-card)",
              }}
            >
              {p.badge && (
                <span className="absolute -top-3 left-4 rounded-full bg-[#d7263d] px-3 py-0.5 text-[11px] font-black uppercase text-white">
                  {p.badge}
                </span>
              )}
              <p className="text-sm font-bold text-[#d7263d]">{p.name}</p>
              <p className="mt-2 font-display text-4xl font-semibold">{p.price}</p>
              <p className="text-xs text-[var(--mkt-muted)]">{p.period}</p>
              <p className="mt-2 text-sm text-[var(--mkt-muted)]">{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-[#d7263d]" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={`mt-6 block text-center ${p.featured ? "slack-btn-primary" : "slack-btn-ghost"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/pricing" className="inline-flex items-center gap-1 font-bold text-[#d7263d]">
            Compare all features <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </section>

      <section className="relative mt-16 overflow-hidden bg-[#d7263d] text-white">
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center md:py-24">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">Whatever you ship, you can watch it in Buzq</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="rounded-md bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-[#d7263d] transition hover:scale-[1.03]">
              Get started
            </Link>
            <Link href="/contact" className="rounded-md border-2 border-white px-6 py-3 text-sm font-black uppercase tracking-wide transition hover:bg-white hover:text-[#d7263d]">
              Talk to sales
            </Link>
          </div>
        </div>
        <svg className="relative -mb-px block w-full text-[var(--mkt-bg)]" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,90 C360,0 1080,0 1440,90 L1440,90 L0,90 Z" />
        </svg>
      </section>
    </MarketingShell>
  );
}
