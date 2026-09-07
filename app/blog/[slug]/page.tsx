import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { POSTS } from "@/lib/content";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.description };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <MarketingShell>
      <PageHero kicker={p.tags.join(" · ")} title={p.title} lede={p.description} />
      <article className="mx-auto max-w-2xl space-y-5 px-4 pb-24 text-lg leading-8 text-[var(--mkt-muted)]">
        {p.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </article>
    </MarketingShell>
  );
}
