import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Terms", description: "Terms of use for the Buzq workspace and ingest API." };

export default function TermsPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Legal" title="Terms" lede="Use Buzq to watch your own products. Do not use it to harass people or to store card numbers." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-sm leading-7 text-[var(--mkt-muted)]">
        <p>The software is provided as-is while in early access. You are responsible for the content of events you ingest, for who you invite, and for rotating API keys. Abuse, scraping, or attempting to access other workspaces is not allowed.</p>
      </div>
    </MarketingShell>
  );
}
