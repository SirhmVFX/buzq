"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  {
    status: "success",
    channel: "signups",
    title: "New user signed up",
    body: "ada@lumen.dev created an account · plan: team",
    color: "#2eb67d",
  },
  {
    status: "error",
    channel: "payments",
    title: "Payment failed",
    body: "Card declined for northstar · $49.00 insufficient_funds",
    color: "#e01e5a",
  },
  {
    status: "warning",
    channel: "signups",
    title: "Signup abandoned",
    body: "Verify-email step skipped after 8 minutes",
    color: "#ecb22e",
  },
  {
    status: "info",
    channel: "deployments",
    title: "Production deploy",
    body: "web@2.14.0 shipped · 0 failed health checks",
    color: "#1d9bd1",
  },
];

export function SlackPreview() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => (v >= EVENTS.length ? 1 : v + 1)), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_30px_80px_rgba(215,38,61,0.18)] ring-1 ring-black/10">
      <div className="flex h-[440px] bg-[#3a0a12] text-[13px]">
        <div className="flex w-12 flex-col items-center gap-2 bg-[#2a070d] py-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#d7263d] text-[11px] font-black text-white">
            B
          </div>
          <div className="h-8 w-8 rounded-lg bg-white/10" />
        </div>
        <div className="flex w-[190px] flex-col bg-[#6e1422] py-3 text-white">
          <p className="px-3 text-[15px] font-black">Lumen</p>
          <p className="mt-3 px-3 text-[11px] uppercase tracking-wider text-white/50">Channels</p>
          {["general", "signups", "payments", "errors", "deployments"].map((c, i) => (
            <div
              key={c}
              className={`mx-2 mt-0.5 rounded px-2 py-0.5 ${i === 2 ? "bg-white/20 font-bold" : "text-white/70"}`}
            >
              # {c}
            </div>
          ))}
          <p className="mt-4 px-3 text-[11px] uppercase tracking-wider text-white/50">Direct messages</p>
          <div className="px-3 py-1 text-white/70">Ada Lovelace</div>
          <div className="px-3 py-1 text-white/70">CEO · Sam</div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1a1d21]">
          <div className="flex h-10 items-center border-b px-3 text-[13px] font-black dark:border-[#2c2d30]">
            # payments
          </div>
          <div className="flex-1 space-y-2 overflow-hidden p-3">
            {EVENTS.slice(0, visible).map((e, i) => (
              <div
                key={i}
                className="float-in rounded-lg border border-black/5 p-2.5 dark:border-white/10"
                style={{ borderLeft: `4px solid ${e.color}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded px-1.5 text-[10px] font-black uppercase text-white" style={{ background: e.color }}>
                    {e.status}
                  </span>
                  <span className="font-mono text-[11px] text-black/40 dark:text-white/40">#{e.channel}</span>
                </div>
                <p className="mt-1 font-black">{e.title}</p>
                <p className="text-[12px] text-black/60 dark:text-white/60">{e.body}</p>
                <p className="mt-1 text-[11px] font-bold text-[#1264a3]">2 replies · Reply in thread</p>
              </div>
            ))}
          </div>
          <div className="m-3 rounded-lg border border-black/10 px-3 py-2 text-[12px] text-black/40 dark:border-white/15 dark:text-white/40">
            Message #payments
          </div>
        </div>
      </div>
    </div>
  );
}
