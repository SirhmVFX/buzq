import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { SlackPreview } from "@/components/marketing/slack-preview";

export const metadata: Metadata = { title: "Watch demo", description: "See Buzq’s Slack-like stream, threads, and event cards." };

export default function Page() {
  return (
    <MarketingShell>
      <PageHero kicker="Demo" title="Watch the stream" lede="Events land like Slack messages. React, thread, invite. This is a live mock of the workspace UI." />
      <div className="mx-auto max-w-5xl px-4 pb-10">
        <SlackPreview />
        <p className="mt-8 text-center">
          <Link href="/signup" className="slack-btn-primary">
            Get started
          </Link>
        </p>
      </div>
    </MarketingShell>
  );
}
