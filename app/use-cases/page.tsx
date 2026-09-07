import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { USE_CASES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Use cases",
  description: "Buzq for startups, developers, CEOs, payments, authentication, and SaaS teams.",
};

export default function UseCasesIndex() {
  return (
    <MarketingShell>
      <PageHero kicker="Use cases" title="Whoever needs to know, gets a channel." lede="Startups, engineers, operators, billing, auth — one workspace, many rooms." />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-2">
        {USE_CASES.map((u) => (
          <Link key={u.slug} href={`/use-cases/${u.slug}`} className="rounded-2xl border p-6 hover:border-[#d7263d]" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            <h2 className="text-xl font-black">{u.title}</h2>
            <p className="mt-2 text-sm text-[var(--mkt-muted)]">{u.lede}</p>
          </Link>
        ))}
      </div>
    </MarketingShell>
  );
}
