"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Check, Info, Minus } from "lucide-react";
import { MarketingShell } from "@/components/marketing/shell";
import { COMPARE_ROWS, PLANS } from "@/lib/content";

export default function PricingPage() {
  return (
    <MarketingShell cta>
      <section className="px-4 pb-6 pt-16 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Choose a paid plan that’s right for your product</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--mkt-muted)]">
          The world’s most anxious founders rely on a stream they actually leave open.
        </p>
      </section>

      <p className="mb-4 text-center text-xs font-black uppercase tracking-[0.16em] text-[var(--mkt-muted)]">Teams who ship, watch Buzq</p>
      <div className="mx-auto mb-10 flex max-w-[1200px] flex-wrap justify-center gap-8 px-4 text-sm font-bold uppercase tracking-widest text-[var(--mkt-muted)]">
        {["Lumen", "Harbor", "Kite", "Northstar", "Fold", "Orbit"].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      <div className="mx-auto grid max-w-[1200px] items-stretch gap-4 px-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className="lift-card relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--mkt-card)]"
            style={{ borderColor: p.featured ? "#d7263d" : "var(--border)" }}
          >
            {p.featured && <div className="bg-[#d7263d] py-1.5 text-center text-[11px] font-black uppercase tracking-wide text-white">{p.badge}</div>}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-3xl font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-[var(--mkt-muted)]">{p.blurb}</p>
              <p className="mt-4 font-display text-5xl font-semibold">{p.price}</p>
              <p className="text-xs text-[var(--mkt-muted)]">{p.period}</p>
              <Link href={p.href} className={`mt-5 ${p.featured ? "slack-btn-primary" : "slack-btn-ghost"}`}>
                {p.cta}
              </Link>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#d7263d]" /> {f}
                  </li>
                ))}
                {p.missing?.map((f) => (
                  <li key={f} className="flex gap-2 text-[var(--mkt-muted)]">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <section className="mx-auto max-w-[1200px] px-4 py-20">
        <h2 className="mb-8 text-center font-display text-4xl font-semibold">Compare all features</h2>
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4" />
                {PLANS.map((p) => (
                  <th key={p.id} className="p-4 text-center">
                    <div className="font-display text-lg">{p.name}</div>
                    <Link href={p.href} className="mt-2 inline-flex slack-btn-primary text-[11px]">
                      {p.cta}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((g) => (
                <Fragment key={g.group}>
                  <tr className="bg-[color-mix(in_srgb,var(--brand)_6%,transparent)]">
                    <td colSpan={5} className="px-4 py-3 text-sm font-black">
                      {g.group}
                    </td>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.name} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 font-bold">
                          {r.name}
                          <span title={r.hint} className="text-[var(--mkt-muted)]">
                            <Info className="h-3.5 w-3.5" />
                          </span>
                        </span>
                      </td>
                      {r.values.map((v, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          {v === "✓" ? <Check className="mx-auto h-4 w-4 text-[#d7263d]" /> : v === "—" ? <span className="text-[var(--mkt-muted)]">—</span> : v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </MarketingShell>
  );
}
