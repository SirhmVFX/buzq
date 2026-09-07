import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Channels & threads",
  description: "Log channels vs chat, private channels, and Slack-style threads on events.",
};

export default function ChannelsDocs() {
  return (
    <MarketingShell>
      <PageHero kicker="Docs" title="Channels & threads" lede="Logs channels are where API events land. Chat channels are for humans. Threads are for incidents." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>Create a channel from the sidebar. Mark it as logs if ingest should live there. Public channels include everyone in the workspace; private channels start with you and whoever you invite.</p>
        <p>Every message — event or chat — can open a thread on the right, the same way Slack does. Reply count lives on the parent. React with emoji. Attach images through Cloudinary from the composer.</p>
      </div>
    </MarketingShell>
  );
}
