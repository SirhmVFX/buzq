import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Invites & DMs",
  description: "Invite people to a Buzq workspace or channel, and chat in direct messages.",
};

export default function InvitesDocs() {
  return (
    <MarketingShell>
      <PageHero kicker="Docs" title="Invites & DMs" lede="A link is enough. Optional email lock. DMs are just another stream." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>From the workspace menu, create an invite. Share the URL. After signup or login, the member is written into the workspace (and an optional private channel).</p>
        <p>Direct messages are created on first click. Participant IDs are sorted so two people always share one thread. Presence dots use Firebase last-seen.</p>
      </div>
    </MarketingShell>
  );
}
