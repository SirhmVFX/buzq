import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("What is Buzq?", "A Slack-like workspace for product events — success, failure, and the conversation in between.");

export default function Page() {
  return (
    <SimpleSeoPage
      kicker="Product"
      title="What is Buzq?"
      lede="Buzq is the room between “the code knows” and “the company knows.”"
      paragraphs={[
        "You already have success and unsuccessful code blocks. Buzq is an API you call from both, plus a workspace that looks like Slack.",
        "Events land as cards with a status color. People react, reply in threads, chat in the channel, and DM each other. Invites bring the CEO in without Grafana.",
        "It is not a replacement for Sentry. It is not Slack incoming webhooks. It is product pulse with Slack muscle memory.",
      ]}
    />
  );
}
