import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("News", "Product announcements and company notes from Buzq.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Company" title="News" lede="See Changelog for shipping. See Blog for longer arguments." paragraphs={["Public preview is live: Slack-like workspace, ingest API, invites, DMs, reactions, light and dark."]} />
  );
}
