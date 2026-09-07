import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Docs",
  description: "Quickstart, ingest API, channels, invites, and SDK snippets for Buzq.",
};

const LINKS = [
  ["/docs/quickstart", "Quickstart", "Create a workspace and send your first event in five minutes."],
  ["/docs/api", "Ingest API", "POST /api/v1/events — channel, status, event, title, message, metadata."],
  ["/docs/sdks", "Snippets", "Node, Python, cURL, and the success/fail pattern."],
  ["/docs/channels", "Channels & threads", "Log streams vs chat, private channels, replies."],
  ["/docs/invites", "Invites & DMs", "Workspace links, channel invites, direct messages."],
];

export default function DocsIndex() {
  return (
    <MarketingShell>
      <PageHero kicker="Docs" title="Wire it once. Watch it live." lede="The ingest API is one POST. The workspace is Slack-shaped on purpose." />
      <div className="mx-auto max-w-3xl space-y-3 px-4 pb-24">
        {LINKS.map(([href, t, d]) => (
          <Link key={href} href={href} className="block rounded-2xl border p-5 hover:border-[#d7263d]" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            <h2 className="font-black">{t}</h2>
            <p className="mt-1 text-sm text-[var(--mkt-muted)]">{d}</p>
          </Link>
        ))}
      </div>
    </MarketingShell>
  );
}
