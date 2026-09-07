import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Ingest API",
  description: "Reference for POST /api/v1/events — the only endpoint your product needs.",
};

export default function ApiDocsPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Docs" title="Ingest API" lede="Authorization: Bearer bzq_live_… CORS is open so any backend can call it." />
      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-24">
        <pre className="overflow-x-auto rounded-2xl p-5 font-mono text-[13px] leading-7" style={{ background: "#1a1214", color: "#f6ecee" }}>{`POST /api/v1/events
Authorization: Bearer bzq_live_…
Content-Type: application/json

{
  "channel": "payments",
  "status": "error",
  "event": "payment.failed",
  "title": "Payment failed",
  "message": "Card declined for jane@acme.com — $49.00",
  "metadata": { "amount": 4900, "code": "insufficient_funds" },
  "source": "billing-service"
}`}</pre>
        <ul className="space-y-2 text-[var(--mkt-muted)]">
          <li><code>channel</code> — slug of an existing channel (without #).</li>
          <li><code>status</code> — success | error | warning | info.</li>
          <li><code>event</code> — namespaced machine name, e.g. user.signup_failed.</li>
          <li><code>title</code> / <code>message</code> — human copy for the card.</li>
          <li><code>metadata</code> — optional JSON shown on the card.</li>
        </ul>
        <p className="text-sm text-[var(--mkt-muted)]">
          The server hashes the API key (SHA-256), looks it up in <code>apiKeyIndex</code>, finds the channel by slug, and writes a message of type <code>event</code>. Firebase snapshots push it to every open client.
        </p>
      </div>
    </MarketingShell>
  );
}
