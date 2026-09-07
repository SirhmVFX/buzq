"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, CloudDownload, Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";

const COLS: { title: string; groups: { heading: string; links: [string, string][] }[] }[] = [
  {
    title: "Product",
    groups: [
      {
        heading: "Product",
        links: [
          ["Watch demo", "/demo"],
          ["Pricing", "/pricing"],
          ["Paid vs Free", "/paid-vs-free"],
          ["Accessibility", "/accessibility"],
          ["Featured releases", "/changelog"],
          ["Changelog", "/changelog"],
          ["Status", "/status"],
        ],
      },
      {
        heading: "Why Buzq?",
        links: [
          ["Buzq vs Slack", "/compare/slack"],
          ["Buzq vs Sentry", "/compare/sentry"],
          ["Enterprise", "/enterprise"],
          ["Small business", "/small-business"],
          ["Productivity", "/productivity"],
          ["Scale", "/enterprise"],
          ["Trust", "/trust"],
        ],
      },
    ],
  },
  {
    title: "Features",
    groups: [
      {
        heading: "Features",
        links: [
          ["Channels", "/docs/channels"],
          ["Messaging", "/features"],
          ["Threads", "/features"],
          ["Reactions", "/features"],
          ["Direct messages", "/docs/invites"],
          ["Ingest API", "/docs/api"],
          ["File sharing", "/integrations"],
          ["Integrations", "/integrations"],
          ["Security", "/security"],
          ["See all features", "/features"],
        ],
      },
    ],
  },
  {
    title: "Solutions",
    groups: [
      {
        heading: "Solutions",
        links: [
          ["Engineering", "/use-cases/developers"],
          ["Leadership", "/use-cases/leadership"],
          ["Startups", "/use-cases/startups"],
          ["Payments", "/use-cases/payments"],
          ["Authentication", "/use-cases/authentication"],
          ["SaaS", "/use-cases/saas"],
          ["Customer service", "/use-cases/leadership"],
          ["See all solutions", "/use-cases"],
        ],
      },
    ],
  },
  {
    title: "Resources",
    groups: [
      {
        heading: "Resources",
        links: [
          ["Help center", "/help"],
          ["What’s new", "/changelog"],
          ["Docs", "/docs"],
          ["Blog", "/blog"],
          ["Customers", "/customers"],
          ["Developers", "/docs/api"],
          ["Community", "/community"],
          ["Events", "/events"],
        ],
      },
    ],
  },
  {
    title: "Company",
    groups: [
      {
        heading: "Company",
        links: [
          ["About us", "/about"],
          ["News", "/news"],
          ["Media kit", "/media-kit"],
          ["Careers", "/careers"],
          ["Contact us", "/contact"],
          ["Privacy", "/privacy"],
          ["Terms", "/terms"],
        ],
      },
    ],
  },
];

export function MarketingFooter() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <footer className="mt-0 border-t" style={{ borderColor: "color-mix(in srgb, var(--brand) 12%, transparent)" }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5">
        <button className="inline-flex items-center gap-2 text-sm font-bold">
          <Globe className="h-4 w-4" /> Change region <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center gap-3 text-[var(--mkt-ink)]">
          <Linkedin className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Facebook className="h-4 w-4" />
          <span className="text-sm font-black">𝕏</span>
          <Youtube className="h-4 w-4" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 pb-12 md:grid-cols-[auto_1fr]">
        <Logo className="text-xl" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {COLS.map((col) => (
            <div key={col.title}>
              <button
                className="flex w-full items-center justify-between text-xs font-black uppercase tracking-[0.16em] md:pointer-events-none"
                onClick={() => setOpen((v) => (v === col.title ? null : col.title))}
              >
                {col.title}
                <ChevronDown className="h-4 w-4 md:hidden" />
              </button>
              <div className={`${open === col.title ? "block" : "hidden"} md:block`}>
                {col.groups.map((g) => (
                  <div key={g.heading} className="mt-4">
                    {g.heading !== col.title && (
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--mkt-muted)]">{g.heading}</p>
                    )}
                    <ul className="space-y-2 text-[15px]">
                      {g.links.map(([label, href]) => (
                        <li key={href + label}>
                          <Link href={href} className="text-[var(--mkt-ink)] transition hover:text-[#d7263d]">
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-[13px] text-[var(--mkt-muted)]">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/download" className="inline-flex items-center gap-1 font-bold hover:text-[#d7263d]">
              <CloudDownload className="h-4 w-4" /> Download snippet
            </Link>
            <Link href="/privacy" className="hover:text-[#d7263d]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#d7263d]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#d7263d]">Cookie preferences</Link>
          </div>
          <p>© {new Date().getFullYear()} Buzq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
