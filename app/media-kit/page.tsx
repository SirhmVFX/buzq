import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Media kit", "Brand color #d7263d, wordmark, and how to talk about Buzq.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Company" title="Media kit" lede="Brand red is #d7263d. The product is “Buzq” — product pulse that looks like Slack." paragraphs={["Do not call it a Slack clone. Call it a Slack-like room aimed at success and failure paths in your app.", "Logo is the live-dot mark plus the word buzq with a red q."]} />
  );
}
