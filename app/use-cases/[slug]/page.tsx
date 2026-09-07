import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { USE_CASES } from "@/lib/content";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/use-cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const u = USE_CASES.find((x) => x.slug === slug);
  if (!u) return {};
  return { title: u.title, description: u.lede };
}

export default async function UseCasePage({ params }: PageProps<"/use-cases/[slug]">) {
  const { slug } = await params;
  const u = USE_CASES.find((x) => x.slug === slug);
  if (!u) notFound();
  return (
    <MarketingShell>
      <PageHero kicker="Use case" title={u.title} lede={u.lede} />
      <ul className="mx-auto max-w-3xl space-y-4 px-4 pb-24">
        {u.points.map((p) => (
          <li key={p} className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            {p}
          </li>
        ))}
      </ul>
    </MarketingShell>
  );
}
