"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Message } from "@/lib/types";
import { CreateChannelModal, CreateWorkspaceModal, InviteModal, PreferencesModal } from "./modals";
import { DmPane } from "./dm-pane";
import { MessagePane } from "./message-pane";
import { WorkspaceRail } from "./rail";
import { Sidebar } from "./sidebar";
import { ThreadPanel } from "./thread-panel";
import { useWorkspace } from "@/lib/workspace-context";
import { MembersDrawer } from "./members-drawer";

export function WorkspaceShell({
  slug,
  channelSlug,
  dmId,
}: {
  slug: string;
  channelSlug?: string;
  dmId?: string;
}) {
  const { user, loading: authLoading } = useAuth();
  const { workspace, channels, dms, loading } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const [thread, setThread] = useState<Message | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [modal, setModal] = useState<"channel" | "invite" | "prefs" | "workspace" | "search" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const channel = useMemo(() => {
    if (channelSlug) return channels.find((c) => c.slug === channelSlug);
    return channels.find((c) => c.isDefault) || channels.find((c) => c.slug === "general") || channels[0];
  }, [channels, channelSlug]);

  const dm = dms.find((d) => d.id === dmId);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    setThread(null);
  }, [pathname]);

  if (authLoading || loading || !workspace) {
    return (
      <div className="grid h-screen place-items-center" style={{ background: "var(--sidebar)", color: "white" }}>
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--main-bg)", color: "var(--main-text)" }}>
      <WorkspaceRail currentSlug={slug} onCreate={() => setModal("workspace")} />
      <div className={`absolute inset-y-0 left-[70px] z-20 md:static md:flex ${sidebarOpen ? "flex" : "hidden md:flex"}`}>
        <Sidebar
          slug={slug}
          activeChannelId={dmId ? undefined : channel?.id}
          activeDmId={dmId}
          onCreateChannel={() => setModal("channel")}
          onInvite={() => setModal("invite")}
          onOpenSearch={() => setModal("search")}
          onOpenPreferences={() => setModal("prefs")}
        />
      </div>

      <div className="flex min-w-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <button
            className="md:hidden absolute left-[78px] top-3 z-10 grid h-8 w-8 place-items-center rounded-md"
            style={{ background: "var(--hover)" }}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <Menu className="h-4 w-4" />
          </button>
          {dmId && dm ? (
            <DmPane dm={dm} />
          ) : channel ? (
            <MessagePane
              channel={channel}
              onOpenThread={setThread}
              onOpenMembers={() => setMembersOpen(true)}
            />
          ) : (
            <div className="grid flex-1 place-items-center text-[var(--main-muted)]">
              Create a channel to get started.
            </div>
          )}
        </div>
        {thread && channel && (
          <ThreadPanel channelId={channel.id} parent={thread} onClose={() => setThread(null)} />
        )}
        {membersOpen && <MembersDrawer onClose={() => setMembersOpen(false)} />}
      </div>

      {modal === "channel" && <CreateChannelModal onClose={() => setModal(null)} />}
      {modal === "invite" && <InviteModal onClose={() => setModal(null)} />}
      {modal === "prefs" && <PreferencesModal onClose={() => setModal(null)} />}
      {modal === "workspace" && <CreateWorkspaceModal onClose={() => setModal(null)} />}
      {modal === "search" && (
        <SearchJump slug={slug} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function SearchJump({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { channels, members } = useWorkspace();
  const [q, setQ] = useState("");
  const router = useRouter();
  const ql = q.toLowerCase();
  const ch = channels.filter((c) => c.name.includes(ql));
  const people = members.filter((m) => m.displayName.toLowerCase().includes(ql) || m.email.toLowerCase().includes(ql));

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/50 p-8 pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl shadow-2xl"
        style={{ background: "var(--main-bg)", color: "var(--main-text)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to a channel or person"
          className="w-full border-b bg-transparent px-4 py-3 text-[16px] outline-none"
          style={{ borderColor: "var(--border)" }}
        />
        <div className="max-h-80 overflow-y-auto p-2">
          {ch.map((c) => (
            <button
              key={c.id}
              className="block w-full rounded-md px-3 py-2 text-left hover:bg-[var(--hover)]"
              onClick={() => {
                router.push(`/workspace/${slug}/c/${c.slug}`);
                onClose();
              }}
            >
              #{c.name}
            </button>
          ))}
          {people.map((m) => (
            <div key={m.userId} className="px-3 py-2 text-[var(--main-muted)]">
              {m.displayName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
