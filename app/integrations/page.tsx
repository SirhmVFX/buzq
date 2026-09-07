import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Integrations", description: "Firebase, Cloudinary, and anything that can POST JSON." };

export default function IntegrationsPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Platform" title="Integrations" lede="Buzq speaks HTTP. If your stack can fail, it can notify." />
      <div className="mx-auto grid max-w-4xl gap-4 px-4 pb-24 sm:grid-cols-2">
        {[
          ["Firebase", "Auth, Firestore realtime, Admin ingest."],
          ["Cloudinary", "Avatars, screenshots, and thread attachments."],
          ["Stripe / Paystack", "From the webhook or the catch around charge.create."],
          ["Next.js / Node", "One fetch in the route handler."],
          ["Python / Go / PHP", "Same JSON body, same Bearer key."],
          ["Mobile", "Client-side only if you are comfortable exposing a restricted key — prefer your backend."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            <h2 className="font-black">{t}</h2>
            <p className="mt-1 text-sm text-[var(--mkt-muted)]">{d}</p>
          </div>
        ))}
      </div>
    </MarketingShell>
  );
}
