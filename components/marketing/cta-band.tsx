import Link from "next/link";

export function CtaBand({
  title = "Whatever you ship, you can watch it in Buzq.",
  primary = { href: "/signup", label: "Get started" },
  secondary = { href: "/contact", label: "Talk to sales" },
}: {
  title?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative mt-8 overflow-hidden bg-[#d7263d] text-white">
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center md:py-24">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={primary.href} className="rounded-md bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-[#d7263d] transition hover:scale-[1.03]">
            {primary.label}
          </Link>
          <Link href={secondary.href} className="rounded-md border-2 border-white px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-[#d7263d]">
            {secondary.label}
          </Link>
        </div>
      </div>
      <svg className="relative -mb-px block w-full text-[var(--mkt-bg)]" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path fill="currentColor" d="M0,90 C360,0 1080,0 1440,90 L1440,90 L0,90 Z" />
      </svg>
    </section>
  );
}
