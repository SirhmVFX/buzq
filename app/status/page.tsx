import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = { title: "Status", description: "Buzq service status." };

export default function StatusPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Ops" title="Status" lede="All systems operational on this deployment — ingest, realtime, and uploads depend on your Firebase and Cloudinary projects." />
      <ul className="mx-auto max-w-md space-y-2 px-4 pb-24">
        {["Marketing", "Workspace UI", "Ingest API", "Firebase Auth", "Cloudinary uploads"].map((s) => (
          <li key={s} className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            {s}
            <span className="text-sm font-bold text-[#2eb67d]">OK</span>
          </li>
        ))}
      </ul>
    </MarketingShell>
  );
}
