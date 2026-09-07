import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Create a Buzq workspace, copy your API key, and fire a success and an error event.",
};

export default function QuickstartPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Docs" title="Quickstart" lede="Five minutes from zero to a red card in #payments." />
      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-24 text-[var(--mkt-muted)]">
        <ol className="list-decimal space-y-4 pl-5">
          <li>Create an account and a workspace. Copy the API key shown once.</li>
          <li>In Firebase Console, enable Email/Password (and Google if you want), and deploy the included Firestore rules.</li>
          <li>Set Cloudinary cloud name (and either an unsigned preset or signing keys) so avatars and attachments upload.</li>
          <li>POST an event to <code>/api/v1/events</code> with your key. Use channel slugs like <code>payments</code> or <code>signups</code>.</li>
          <li>Open the matching channel. Reply in the thread. Invite a teammate.</li>
        </ol>
        <p>You can also press “Send success” / “Send fail” in a logs channel to demo without Admin credentials.</p>
      </div>
    </MarketingShell>
  );
}
