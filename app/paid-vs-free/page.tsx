import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Paid vs Free", "What you get on Buzq Free versus Team and Scale.");

export default function Page() {
  return (
    <SimpleSeoPage
      kicker="Pricing"
      title="Paid vs Free"
      lede="Free is enough to instrument one product. Paid is when the whole company lives in the stream."
      paragraphs={[
        "Free includes default log channels, threads, reactions, DMs, and a 7-day history. One API key. Ten people.",
        "Team unlocks unlimited history, private channels, more keys, and priority ingest. Scale adds SSO-ready workspaces and SLA support.",
        "Compare every row on the pricing page — the table is the source of truth.",
      ]}
    />
  );
}
