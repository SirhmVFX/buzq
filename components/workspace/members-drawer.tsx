"use client";

import { X } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";
import { Avatar } from "./avatar";

export function MembersDrawer({ onClose }: { onClose: () => void }) {
  const { members } = useWorkspace();
  return (
    <aside
      className="flex w-72 shrink-0 flex-col border-l"
      style={{ background: "var(--main-bg)", borderColor: "var(--border)" }}
    >
      <header className="flex h-[49px] items-center justify-between border-b px-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-black">Members · {members.length}</h2>
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--hover)]">
          <X className="h-5 w-5" />
        </button>
      </header>
      <div className="slack-scroll flex-1 overflow-y-auto p-2">
        {members.map((m) => (
          <div key={m.userId} className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[var(--hover)]">
            <Avatar name={m.displayName} photoURL={m.photoURL} size={32} presence="active" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{m.displayName}</p>
              <p className="truncate text-xs text-[var(--main-muted)]">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
