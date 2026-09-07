import Link from "next/link";

export function Logo({ className = "", mark = true }: { className?: string; mark?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-display font-semibold tracking-tight ${className}`}>
      {mark && (
        <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-[#d7263d] text-white shadow-[0_8px_20px_rgba(215,38,61,0.35)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M4 14c3-1 5 2 8 0s5-3 8-1"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M4 9c3-1 5 2 8 0s5-3 8-1"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white live-dot" />
        </span>
      )}
      <span>
        buz<span className="text-[#d7263d]">q</span>
      </span>
    </Link>
  );
}
