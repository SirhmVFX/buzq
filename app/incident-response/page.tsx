import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Incident response",
  description: "Turn a failed code path into a Slack-style thread your team can work in.",
};

export default function IncidentPage() {
  return (
    <MarketingShell>
      <PageHero kicker="SEO" title="Incidents that start as a card" lede="When the unsuccessful block runs, the thread is already there." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>PagerDuty is for waking people. A Buzq thread is for working the problem: paste context, attach a screenshot, DM the owner, react when it is fixed. The original event stays pinned at the top of the thread the same way Slack keeps the parent message.</p>
      </div>
    </MarketingShell>
  );
}
