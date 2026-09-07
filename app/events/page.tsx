import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Events", "Talks and office hours about watching products in realtime.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Resources" title="Events" lede="No upcoming dates yet. Follow the changelog and blog." paragraphs={["When we host a session it will be about instrumentation, not slides about synergy."]} />
  );
}
