"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Hash,
  Lock,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getOrCreateDM } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";
import { Avatar } from "./avatar";

export function Sidebar({
  slug,
  activeChannelId,
  activeDmId,
  onCreateChannel,
  onInvite,
  onOpenSearch,
  onOpenPreferences,
}: {
  slug: string;
  activeChannelId?: string;
  activeDmId?: string;
  onCreateChannel: () => void;
  onInvite: () => void;
  onOpenSearch: () => void;
  onOpenPreferences: () => void;
}) {
  const { user, logout } = useAuth();
  const { workspace, channels, members, dms, memberMap } = useWorkspace();
  const router = useRouter();
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const [menu, setMenu] = useState(false);

  const logs = channels.filter((c) => c.kind === "logs" && !c.isArchived);
  const chat = channels.filter((c) => c.kind !== "logs" && !c.isArchived);

  async function openDm(uid: string) {
    if (!workspace || !user) return;
    const id = await getOrCreateDM(workspace.id, user.id, uid);
    router.push(`/workspace/${slug}/dm/${id}`);
  }

  return (
    <aside className="flex w-[260px] shrink-0 flex-col text-[15px]" style={{ background: "var(--sidebar)", color: "var(--sidebar-text)" }}>
      <button
        onClick={() => setMenu((v) => !v)}
        className="relative flex h-[49px] items-center justify-between border-b px-3"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span className="flex items-center gap-1 truncate font-black">
          {workspace?.name}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
          <Search className="h-4 w-4" />
        </span>
        {menu && (
          <div
            className="absolute left-2 top-12 z-50 w-64 rounded-lg py-2 text-left shadow-xl"
            style={{ background: "var(--main-bg)", color: "var(--main-text)" }}
          >
            <div className="px-3 pb-2">
              <p className="font-black">{workspace?.name}</p>
              <p className="text-xs text-[var(--main-muted)]">{workspace?.slug}.buzq</p>
            </div>
            <MenuItem onClick={onInvite}>Invite people</MenuItem>
            <MenuItem onClick={onCreateChannel}>Create a channel</MenuItem>
            <MenuItem onClick={() => router.push(`/workspace/${slug}/settings`)}>Workspace settings</MenuItem>
            <MenuItem onClick={onOpenPreferences}>Preferences</MenuItem>
            <MenuItem
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
            >
              Sign out
            </MenuItem>
          </div>
        )}
      </button>

      <button
        onClick={onOpenSearch}
        className="mx-3 mt-2 flex h-8 items-center gap-2 rounded-md bg-black/20 px-2 text-[13px]"
        style={{ color: "var(--sidebar-muted)" }}
      >
        <Search className="h-4 w-4" />
        Jump to…
      </button>

      <nav className="slack-scroll mt-2 flex-1 overflow-y-auto pb-4">
        <SideLink href={`/workspace/${slug}`} active={!activeChannelId && !activeDmId} icon={<MessageSquare className="h-4 w-4" />}>
          Threads
        </SideLink>

        <Section title="Channels" open={channelsOpen} onToggle={() => setChannelsOpen((v) => !v)} onAdd={onCreateChannel}>
          {channelsOpen &&
            [...chat, ...logs].map((c) => (
              <SideLink
                key={c.id}
                href={`/workspace/${slug}/c/${c.slug}`}
                active={c.id === activeChannelId}
                icon={c.type === "private" ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
              >
                {c.name}
              </SideLink>
            ))}
        </Section>

        <Section title="Direct messages" open={dmsOpen} onToggle={() => setDmsOpen((v) => !v)} onAdd={onInvite}>
          {dmsOpen && (
            <>
              {dms.map((d) => {
                const otherId = d.participantIds.find((id) => id !== user?.id) || d.participantIds[0];
                const other = memberMap[otherId];
                return (
                  <SideLink
                    key={d.id}
                    href={`/workspace/${slug}/dm/${d.id}`}
                    active={d.id === activeDmId}
                    icon={
                      <Avatar name={other?.displayName || "Member"} photoURL={other?.photoURL} size={20} presence="active" />
                    }
                  >
                    {other?.displayName || "Member"}
                  </SideLink>
                );
              })}
              {members
                .filter((m) => m.userId !== user?.id)
                .slice(0, 12)
                .map((m) => (
                  <button
                    key={m.userId}
                    onClick={() => void openDm(m.userId)}
                    className="flex w-full items-center gap-2 px-4 py-1 text-left hover:bg-[var(--sidebar-hover)]"
                    style={{ color: "var(--sidebar-muted)" }}
                  >
                    <Avatar name={m.displayName} photoURL={m.photoURL} size={20} />
                    <span className="truncate">{m.displayName}</span>
                  </button>
                ))}
            </>
          )}
        </Section>
      </nav>

      <div className="flex items-center gap-2 border-t px-3 py-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Avatar name={user?.displayName || "You"} photoURL={user?.photoURL} size={32} presence="active" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold">{user?.displayName}</p>
          <p className="text-[11px]" style={{ color: "var(--sidebar-muted)" }}>
            Active
          </p>
        </div>
        <button onClick={onOpenPreferences} className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/10">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

function Section({
  title,
  open,
  onToggle,
  onAdd,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <div className="flex items-center px-2">
        <button onClick={onToggle} className="flex flex-1 items-center gap-1 px-2 py-1 text-[15px] font-medium" style={{ color: "var(--sidebar-muted)" }}>
          <ChevronDown className={cn("h-3.5 w-3.5 transition", !open && "-rotate-90")} />
          {title}
        </button>
        <button onClick={onAdd} className="grid h-6 w-6 place-items-center rounded hover:bg-white/10" style={{ color: "var(--sidebar-muted)" }}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  );
}

function SideLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "mx-2 flex items-center gap-2 rounded-md px-2 py-1",
        active ? "bg-[var(--sidebar-active)] font-bold text-white" : "hover:bg-[var(--sidebar-hover)]"
      )}
      style={{ color: active ? "var(--sidebar-text)" : "var(--sidebar-muted)" }}
    >
      <span className="opacity-80">{icon}</span>
      <span className="truncate">{children}</span>
    </Link>
  );
}

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="block w-full px-3 py-1.5 text-left text-[15px] hover:bg-[var(--hover)]">
      {children}
    </button>
  );
}
