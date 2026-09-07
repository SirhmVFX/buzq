import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Changelog", description: "What shipped in Buzq." };

export default function ChangelogPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Product" title="Changelog" lede="The stream, the threads, the keys." />
      <div className="mx-auto max-w-2xl space-y-8 px-4 pb-24">
        {[
          ["2026.09", "Public preview. Slack-like workspace, ingest API, invites, DMs, light and dark."],
          ["2026.08", "Event cards, default log channels, hashed API keys, Cloudinary composer uploads."],
        ].map(([d, t]) => (
          <div key={d}>
            <p className="font-mono text-sm text-[#d7263d]">{d}</p>
            <p className="mt-1 text-[var(--mkt-muted)]">{t}</p>
          </div>
        ))}
      </div>
    </MarketingShell>
  );
}
