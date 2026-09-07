import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Customers", description: "Teams using Buzq to watch signups, payments, and failures in realtime." };

export default function CustomersPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Social proof" title="Customers" lede="Early teams use Buzq as the room between “the code knows” and “the company knows.”" />
      <div className="mx-auto grid max-w-4xl gap-4 px-4 pb-24 sm:grid-cols-2">
        {[
          ["Lumen", "“#payments replaced the Slack webhook we kept muting.”"],
          ["Harbor", "“The CEO actually sits in #signups now.”"],
          ["Kite", "“Failed OAuth was invisible until it had a card and a thread.”"],
          ["Fold", "“We instrumented success too. The channel is not a graveyard.”"],
        ].map(([n, q]) => (
          <blockquote key={n} className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            <p>{q}</p>
            <footer className="mt-3 text-sm font-bold text-[#d7263d]">{n}</footer>
          </blockquote>
        ))}
      </div>
    </MarketingShell>
  );
}
