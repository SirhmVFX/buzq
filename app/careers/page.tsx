import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Careers", description: "Buzq is a small team. We hire people who have been paged by their own products." };

export default function CareersPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Company" title="Careers" lede="No open roles yet. If you have shipped something that broke on a Friday, write to us via Contact." />
      <p className="mx-auto max-w-2xl px-4 pb-24 text-[var(--mkt-muted)]">We care about product taste, realtime systems, and writing that a CEO will finish.</p>
    </MarketingShell>
  );
}
