import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { COMPARE } from "@/lib/content";

export function generateStaticParams() {
  return COMPARE.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARE.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: c.title, description: c.lede };
}

export default async function ComparePage({ params }: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  const c = COMPARE.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <MarketingShell>
      <PageHero kicker="Compare" title={c.title} lede={c.lede} />
      <article className="mx-auto max-w-2xl space-y-4 px-4 pb-24 text-lg leading-8 text-[var(--mkt-muted)]">
        {c.body.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </article>
    </MarketingShell>
  );
}
