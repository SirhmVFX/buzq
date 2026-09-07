"use client";

import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { initials } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";

export function WorkspaceRail({ currentSlug, onCreate }: { currentSlug: string; onCreate: () => void }) {
  const { workspaces } = useWorkspace();

  return (
    <div
      className="flex w-[70px] shrink-0 flex-col items-center gap-2 py-3"
      style={{ background: "var(--rail)" }}
    >
      {workspaces.map((w) => (
        <Link
          key={w.id}
          href={`/workspace/${w.slug}`}
          title={w.name}
          className="grid h-9 w-9 place-items-center rounded-[8px] text-[13px] font-black text-white transition hover:rounded-[12px]"
          style={{
            background: w.slug === currentSlug ? "#d7263d" : "#3d1118",
            boxShadow: w.slug === currentSlug ? "0 0 0 3px rgba(255,255,255,0.35)" : undefined,
          }}
        >
          {w.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={w.iconUrl} alt="" className="h-full w-full rounded-[8px] object-cover" />
          ) : (
            initials(w.name)
          )}
        </Link>
      ))}
      <Link
        href={`/workspace/${currentSlug}`}
        className="mt-1 grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10"
        title="Home"
      >
        <Home className="h-5 w-5" />
      </Link>
      <button
        onClick={onCreate}
        className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10"
        title="Create workspace"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
