"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import {
  listenChannels,
  listenDMs,
  listenMembers,
  listenUserWorkspaces,
  listenWorkspace,
  setPresence,
} from "./db";
import type { Channel, DirectMessageThread, UserWorkspaceLink, Workspace, WorkspaceMember } from "./types";

interface WorkspaceContextType {
  workspaces: UserWorkspaceLink[];
  workspace: Workspace | null;
  members: WorkspaceMember[];
  channels: Channel[];
  dms: DirectMessageThread[];
  loading: boolean;
  memberMap: Record<string, WorkspaceMember>;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: ReactNode;
}) {
  const { uid } = useAuth();
  const [workspaces, setWorkspaces] = useState<UserWorkspaceLink[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [dms, setDms] = useState<DirectMessageThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    return listenUserWorkspaces(uid, setWorkspaces);
  }, [uid]);

  useEffect(() => {
    if (!workspaceId) return;
    setLoading(true);
    const unsubs = [
      listenWorkspace(workspaceId, (ws) => {
        setWorkspace(ws);
        setLoading(false);
      }),
      listenMembers(workspaceId, setMembers),
      listenChannels(workspaceId, setChannels),
    ];
    return () => unsubs.forEach((u) => u());
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId || !uid) return;
    return listenDMs(workspaceId, uid, setDms);
  }, [workspaceId, uid]);

  useEffect(() => {
    if (!uid) return;
    setPresence(uid, "active").catch(() => {});
    const onHide = () => setPresence(uid, document.hidden ? "away" : "active").catch(() => {});
    const onLeave = () => setPresence(uid, "offline").catch(() => {});
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [uid]);

  const memberMap = useMemo(() => {
    const map: Record<string, WorkspaceMember> = {};
    for (const m of members) map[m.userId] = m;
    return map;
  }, [members]);

  const value = useMemo(
    () => ({ workspaces, workspace, members, channels, dms, loading, memberMap }),
    [workspaces, workspace, members, channels, dms, loading, memberMap]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

export function useOptionalWorkspace() {
  return useContext(WorkspaceContext);
}
