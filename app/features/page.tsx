import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { FEATURES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description: "Slack-like channels, event cards, threads, invites, DMs, and a two-line ingest API.",
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <PageHero
        kicker="Product"
        title="Everything Slack trained you to expect — pointed at your product."
        lede="Channels, threads, DMs, invites, a composer, light and dark. Events arrive as first-class cards with a status, a title, and metadata your team can actually read."
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <article key={f.title} className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            <h2 className="text-xl font-black">{f.title}</h2>
            <p className="mt-2 text-[var(--mkt-muted)]">{f.body}</p>
          </article>
        ))}
      </div>
      <p className="pb-16 text-center">
        <Link href="/signup" className="font-bold text-[#d7263d]">
          Create a workspace →
        </Link>
      </p>
    </MarketingShell>
  );
}
