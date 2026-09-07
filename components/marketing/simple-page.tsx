import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export function SimpleSeoPage({
  kicker,
  title,
  lede,
  paragraphs,
  metadata,
}: {
  kicker: string;
  title: string;
  lede: string;
  paragraphs: string[];
  metadata?: never;
}) {
  void metadata;
  return (
    <MarketingShell>
      <PageHero kicker={kicker} title={title} lede={lede} />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-[var(--mkt-muted)]">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
    </MarketingShell>
  );
}

export function seo(title: string, description: string): Metadata {
  return { title, description };
}
