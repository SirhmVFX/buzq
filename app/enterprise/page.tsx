import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Enterprise", "Buzq for companies that need SSO-ready pulse, hashed keys, and rooms the whole org can live in.");

export default function Page() {
  return (
    <SimpleSeoPage
      kicker="Enterprise"
      title="Product pulse that scales with the company"
      lede="Private channels, rotatable keys, and a stream operators will actually leave open — without handing out production access."
      paragraphs={[
        "Enterprise Buzq is the same Slack-like workspace, with more keys, longer history, and an ingest path built for volume.",
        "Invite security, support, and leadership into the channels that matter. Keep #errors for engineering. Keep billing in #payments.",
        "Talk to sales if you need SSO, audit-friendly key management, or a dedicated success path.",
      ]}
    />
  );
}
