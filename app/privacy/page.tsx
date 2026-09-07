import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Privacy", description: "How Buzq handles account, event, and invite data." };

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Legal" title="Privacy" lede="Events can contain customer data. Treat channels like you treat Slack: invite carefully." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-sm leading-7 text-[var(--mkt-muted)]">
        <p>We store account profiles, workspace membership, messages, and hashed API keys in Firebase. File uploads go to Cloudinary. We do not sell event payloads. You decide what metadata you send — do not put secrets in events.</p>
        <p>Invites include an email if you provide one. Presence is last-seen plus a status. You can ask for account deletion by contacting us.</p>
      </div>
    </MarketingShell>
  );
}
