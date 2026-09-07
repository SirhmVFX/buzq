import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing/shell";
import { POSTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on product pulse, broken payments, signup funnels, and ops chat.",
};

export default function BlogIndex() {
  return (
    <MarketingShell>
      <PageHero kicker="Blog" title="Notes from the stream" lede="How teams actually find out what is broken — and how to stop finding out late." />
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-24">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-2xl border p-6 hover:border-[#d7263d]" style={{ borderColor: "var(--border)", background: "var(--mkt-card)" }}>
            <p className="text-xs text-[var(--mkt-muted)]">{p.date} · {p.read}</p>
            <h2 className="mt-1 text-2xl font-black">{p.title}</h2>
            <p className="mt-2 text-[var(--mkt-muted)]">{p.description}</p>
          </Link>
        ))}
      </div>
    </MarketingShell>
  );
}
