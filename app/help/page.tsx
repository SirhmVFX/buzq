import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Help Center", "Docs, quickstart, and how to instrument success and fail blocks.");

export default function Page() {
  return (
    <SimpleSeoPage
      kicker="Resources"
      title="Help Center"
      lede="Start with Quickstart. Then the ingest API. Then invites."
      paragraphs={[
        "Create a workspace, copy the API key, POST to /api/v1/events with a channel slug and a status.",
        "Need a human? Use Contact. Need a snippet? Developers and SDKs live under Docs.",
        "Workspace settings is where you mint and revoke keys once you are inside the app.",
      ]}
    />
  );
}
