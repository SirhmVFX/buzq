import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "For CTOs", description: "A product pulse workspace that does not replace your APM — it makes the business visible." };

export default function CtoPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Leadership" title="For CTOs" lede="Give the rest of the org a window without giving them production access." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>Hashed API keys, workspace roles, private channels, and an ingest path that never runs in the browser unless you choose to. Firebase rules keep tenants apart. You keep Sentry. You add a human stream.</p>
      </div>
    </MarketingShell>
  );
}
