import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "About",
  description: "Buzq is product pulse for teams who are tired of finding out too late.",
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero kicker="About" title="A room for the moments your code already knows." lede="Startups, developers, and operators share a problem: the product fails quietly. Dashboards do not interrupt. Email is late. Slack is for everything else." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>Buzq is a Slack-like workspace whose first-class citizen is an event from your app. Success and failure are the same shape. Threads are how humans respond. Firebase keeps it live. Cloudinary holds the pictures.</p>
        <p>The brand red — <span className="font-mono text-[#d7263d]">#d7263d</span> — is intentional. When something is wrong, it should look like it. When something is right, the green card still belongs in the same stream.</p>
      </div>
    </MarketingShell>
  );
}
