import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Observability for humans",
  description: "Event-driven observability that looks like Slack instead of another dashboard.",
};

export default function ObservabilityPage() {
  return (
    <MarketingShell>
      <PageHero kicker="SEO" title="Observability your whole company will leave open" lede="Stack traces belong in an APM. Business events belong in a channel." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>Most observability stacks optimize for engineers querying logs. Buzq optimizes for a sentence landing in a room: status, title, metadata, thread. That is enough to catch a broken registration, a dead worker, or a declined invoice without opening Grafana.</p>
        <p>Pair it with Sentry for exceptions. Pair it with Stripe for money. Pair it with your auth provider for identity. The integration is always the same POST.</p>
      </div>
    </MarketingShell>
  );
}
