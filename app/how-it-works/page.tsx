import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "How it works",
  description: "Create a workspace, drop API calls into success and fail blocks, talk in Slack-like channels.",
};

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <PageHero
        kicker="How it works"
        title="Two requests. A room that looks like Slack."
        lede="You already know when a signup works and when a payment fails — that knowledge is in your code. Buzq is the missing conversation."
      />
      <ol className="mx-auto max-w-3xl space-y-8 px-4 pb-24">
        {[
          ["Create a workspace", "Onboarding spins up #general, #signups, #payments, #errors, #deployments, and #random. You get an API key shown once."],
          ["Instrument both paths", "POST /api/v1/events with a Bearer key. Set channel to a slug you already have. Set status to success or error."],
          ["Watch the stream", "Firebase writes the message. Everyone in the workspace sees it land, live, like Slack."],
          ["Reply in a thread", "A failed charge becomes an incident room. Attach screenshots via Cloudinary. React. DM the person on call."],
          ["Invite the company", "Workspace links and optional emails. Private channels stay invite-only."],
        ].map(([t, d], i) => (
          <li key={t} className="flex gap-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d7263d] text-sm font-black text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="text-xl font-black">{t}</h2>
              <p className="mt-1 text-[var(--mkt-muted)]">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </MarketingShell>
  );
}
