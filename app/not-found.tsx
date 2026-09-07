import { MarketingShell } from "@/components/marketing/shell";

export default function NotFound() {
  return (
    <MarketingShell>
      <div className="px-4 py-32 text-center">
        <p className="font-mono text-sm text-[#d7263d]">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">This channel does not exist</h1>
        <p className="mt-3 text-[var(--mkt-muted)]">The page may have moved. Try the home stream.</p>
        <a href="/" className="mt-6 inline-block font-bold text-[#d7263d]">
          Back to buzq
        </a>
      </div>
    </MarketingShell>
  );
}
