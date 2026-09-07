"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CloudDownload, Menu, Moon, Play, Search, Sun, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

type Item = { href: string; title: string; desc?: string };
type Mega = { id: "features" | "solutions" | "resources"; label: string; columns: { heading: string; items: Item[] }[]; aside?: { title: string; body: string; href: string; extra?: Item[] }; footer: Item[] };

const MEGAS: Mega[] = [
  {
    id: "features",
    label: "Features",
    columns: [
      {
        heading: "Collaboration",
        items: [
          { href: "/docs/channels", title: "Channels", desc: "Log streams and team chat" },
          { href: "/docs/invites", title: "Invites", desc: "Bring the company in" },
          { href: "/features", title: "Messaging", desc: "Chat under any event" },
          { href: "/features", title: "Threads", desc: "Incident rooms on a card" },
          { href: "/features", title: "Reactions", desc: "Emoji, just like Slack" },
        ],
      },
      {
        heading: "Product pulse",
        items: [
          { href: "/docs/api", title: "Ingest API", desc: "Success and fail in one POST" },
          { href: "/use-cases/payments", title: "Payments", desc: "Declines, charges, refunds" },
          { href: "/use-cases/authentication", title: "Signups", desc: "Complete, incomplete, failed" },
          { href: "/use-cases/developers", title: "Errors", desc: "Catch blocks that talk" },
        ],
      },
      {
        heading: "Platform",
        items: [
          { href: "/integrations", title: "Integrations", desc: "Anything that can POST JSON" },
          { href: "/docs/sdks", title: "Snippets", desc: "Node, Python, cURL" },
          { href: "/security", title: "Security", desc: "Hashed keys, scoped rules" },
        ],
      },
    ],
    aside: {
      title: "What’s new",
      body: "Threads, reactions, and a Slack-like composer — aimed at your product.",
      href: "/changelog",
      extra: [
        { href: "/what-is-buzq", title: "What is Buzq?" },
        { href: "/compare/slack", title: "Buzq vs Slack" },
        { href: "/accessibility", title: "Accessibility" },
      ],
    },
    footer: [
      { href: "/demo", title: "Watch demo" },
      { href: "/download", title: "Download the snippet" },
      { href: "/features", title: "See all features" },
    ],
  },
  {
    id: "solutions",
    label: "Solutions",
    columns: [
      {
        heading: "By role",
        items: [
          { href: "/use-cases/developers", title: "Engineering" },
          { href: "/for-ctos", title: "IT / CTO" },
          { href: "/use-cases/leadership", title: "Leadership" },
          { href: "/use-cases/payments", title: "Customer success" },
          { href: "/use-cases/saas", title: "Sales & ops" },
          { href: "/security", title: "Security" },
        ],
      },
      {
        heading: "By industry",
        items: [
          { href: "/use-cases/startups", title: "Startups" },
          { href: "/use-cases/saas", title: "SaaS / technology" },
          { href: "/small-business", title: "Small business" },
          { href: "/use-cases/payments", title: "Financial services" },
          { href: "/enterprise", title: "Enterprise" },
        ],
      },
    ],
    aside: {
      title: "Template gallery",
      body: "Start faster with ready channels for signups, payments, errors, and deploys.",
      href: "/how-it-works",
      extra: [
        { href: "/productivity", title: "Productivity" },
        { href: "/enterprise", title: "Scale" },
        { href: "/trust", title: "Trust" },
      ],
    },
    footer: [
      { href: "/demo", title: "Watch demo" },
      { href: "/use-cases", title: "See all solutions" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        items: [
          { href: "/docs", title: "Docs" },
          { href: "/blog", title: "Blog" },
          { href: "/changelog", title: "What’s new" },
          { href: "/how-it-works", title: "Product tour" },
          { href: "/customers", title: "Customer stories" },
        ],
      },
      {
        heading: "Build",
        items: [
          { href: "/docs/api", title: "Developers" },
          { href: "/docs/sdks", title: "Snippets" },
          { href: "/integrations", title: "Integrations" },
          { href: "/help", title: "Help center" },
        ],
      },
    ],
    aside: {
      title: "Winning the moment something breaks",
      body: "How teams stop finding out on Monday.",
      href: "/blog/why-startups-miss-broken-payments",
      extra: [
        { href: "/help", title: "Help center" },
        { href: "/contact", title: "Customer support" },
      ],
    },
    footer: [
      { href: "/demo", title: "Watch demo" },
      { href: "/docs/quickstart", title: "Quickstart" },
    ],
  },
];

export function MarketingNav() {
  const { resolved, toggle } = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<Mega["id"] | null>(null);
  const [search, setSearch] = useState(false);
  const leaveTimer = useRef<number | null>(null);

  function enter(id: Mega["id"]) {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    setMega(id);
  }
  function leave() {
    leaveTimer.current = window.setTimeout(() => setMega(null), 120);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(null);
        setSearch(false);
        setOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = MEGAS.find((m) => m.id === mega);

  return (
    <header className="sticky top-0 z-50 border-b bg-[var(--mkt-bg)]/90 backdrop-blur-xl" style={{ borderColor: "color-mix(in srgb, var(--brand) 12%, transparent)" }}>
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-6 px-4">
        <Logo className="text-[17px]" />
        <nav className="hidden flex-1 items-center gap-1 lg:flex" onMouseLeave={leave}>
          {MEGAS.map((m) => (
            <button
              key={m.id}
              onMouseEnter={() => enter(m.id)}
              onFocus={() => enter(m.id)}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-bold transition ${
                mega === m.id ? "bg-black/5 text-[#d7263d] dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {m.label}
              <ChevronDown className={`h-3.5 w-3.5 transition ${mega === m.id ? "rotate-180" : ""}`} />
            </button>
          ))}
          <Link href="/enterprise" className="rounded-md px-3 py-2 text-[15px] font-bold hover:bg-black/5 dark:hover:bg-white/10">
            Enterprise
          </Link>
          <Link href="/pricing" className="rounded-md px-3 py-2 text-[15px] font-bold hover:bg-black/5 dark:hover:bg-white/10">
            Pricing
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="Toggle theme">
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <Link href="/onboarding" className="slack-btn-primary hidden sm:inline-flex">
              Open app
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden px-3 text-[15px] font-bold md:inline">
                Sign in
              </Link>
              <Link href="/contact" className="slack-btn-ghost hidden md:inline-flex">
                Request a demo
              </Link>
              <Link href="/signup" className="slack-btn-primary">
                Get started
              </Link>
            </>
          )}
          <button className="grid h-10 w-10 place-items-center lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {active && (
        <div className="absolute left-0 right-0 px-4 pb-4" onMouseEnter={() => enter(active.id)} onMouseLeave={leave}>
          <div className="mega-in mx-auto max-w-[1200px] overflow-hidden rounded-2xl border bg-[var(--mkt-card)] shadow-[0_24px_80px_rgba(26,10,13,0.16)]" style={{ borderColor: "var(--border)" }}>
            <div className="grid gap-0 lg:grid-cols-[1fr_240px]">
              <div className="grid gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3">
                {active.columns.map((col) => (
                  <div key={col.heading}>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--mkt-muted)]">{col.heading}</p>
                    <ul className="mt-3 space-y-3">
                      {col.items.map((it) => (
                        <li key={it.href + it.title}>
                          <Link href={it.href} onClick={() => setMega(null)} className="group block">
                            <span className="font-bold group-hover:text-[#d7263d]">{it.title}</span>
                            {it.desc && <span className="mt-0.5 block text-[13px] text-[var(--mkt-muted)]">{it.desc}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {active.aside && (
                <aside className="border-t p-6 lg:border-l lg:border-t-0" style={{ background: "color-mix(in srgb, var(--brand) 6%, var(--mkt-card))", borderColor: "var(--border)" }}>
                  <p className="font-black">{active.aside.title}</p>
                  <p className="mt-2 text-sm text-[var(--mkt-muted)]">{active.aside.body}</p>
                  <Link href={active.aside.href} onClick={() => setMega(null)} className="mt-3 inline-flex items-center font-bold text-[#d7263d]">
                    Learn more →
                  </Link>
                  <ul className="mt-6 space-y-2 text-sm font-bold">
                    {active.aside.extra?.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} onClick={() => setMega(null)} className="hover:text-[#d7263d]">
                          {it.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6 border-t px-8 py-3 text-sm font-bold" style={{ borderColor: "var(--border)" }}>
              {active.footer.map((it) => (
                <Link key={it.href} href={it.href} onClick={() => setMega(null)} className="inline-flex items-center gap-2 text-[#d7263d] hover:underline">
                  {it.title.includes("demo") && <Play className="h-3.5 w-3.5" />}
                  {it.title.includes("Download") && <CloudDownload className="h-3.5 w-3.5" />}
                  {it.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="max-h-[70vh] overflow-y-auto border-t px-4 py-4 lg:hidden" style={{ borderColor: "var(--border)" }}>
          {[...MEGAS.flatMap((m) => m.columns.flatMap((c) => c.items)), { href: "/enterprise", title: "Enterprise" }, { href: "/pricing", title: "Pricing" }].map((it) => (
            <Link key={it.href + it.title} href={it.href} className="block py-2 font-bold" onClick={() => setOpen(false)}>
              {it.title}
            </Link>
          ))}
        </div>
      )}

      {search && <MarketingSearch onClose={() => setSearch(false)} />}
    </header>
  );
}

function MarketingSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const links = [
    ["Features", "/features"],
    ["Pricing", "/pricing"],
    ["Ingest API", "/docs/api"],
    ["Quickstart", "/docs/quickstart"],
    ["For startups", "/use-cases/startups"],
    ["Payments", "/use-cases/payments"],
    ["Blog", "/blog"],
    ["Sign in", "/login"],
  ];
  const filtered = links.filter(([l]) => l.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[60] grid place-items-start bg-black/40 p-4 pt-[12vh]" onClick={onClose}>
      <div className="mega-in w-full max-w-xl overflow-hidden rounded-2xl bg-[var(--mkt-card)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Buzq" className="w-full border-b bg-transparent px-4 py-3 text-lg outline-none" style={{ borderColor: "var(--border)" }} />
        <div className="p-2">
          {filtered.map(([l, h]) => (
            <Link key={h} href={h} onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-[var(--hover)]">
              {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
