import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Security", description: "Hashed API keys, Firebase rules, and Cloudinary signed uploads." };

export default function SecurityPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Trust" title="Security" lede="Keys are hashed. Rules scope data to members. Uploads can be signed." />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        <p>API keys are stored as SHA-256 hashes with a prefix for display. The ingest route uses Firebase Admin so your product never needs a user session. Firestore rules keep messages inside workspaces you belong to.</p>
        <p>Rotate keys from workspace settings. Revoked hashes are marked in the index. Prefer sending identifiers, not raw PII, in metadata.</p>
      </div>
    </MarketingShell>
  );
}
