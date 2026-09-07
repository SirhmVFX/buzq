"use client";

import { FormEvent, useState } from "react";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }
  return (
    <MarketingShell>
      <PageHero kicker="Contact" title="Talk to us" lede="Sales, partnerships, or a broken ingest — we read this." />
      <div className="mx-auto max-w-md px-4 pb-24">
        {sent ? (
          <p className="text-center font-bold">Thanks. We’ll get back to you.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input required className="field" name="name" placeholder="Name" />
            <input required type="email" className="field" name="email" placeholder="Email" />
            <textarea required className="field min-h-32" name="message" placeholder="How can we help?" />
            <button className="w-full rounded-full bg-[#d7263d] py-2.5 font-bold text-white">Send</button>
          </form>
        )}
      </div>
    </MarketingShell>
  );
}
