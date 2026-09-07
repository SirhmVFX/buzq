"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { createChannel, createInvite, createWorkspace } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { channelSlug, siteUrl } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";
import type { ChannelKind, ChannelType } from "@/lib/types";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl p-5 shadow-2xl"
        style={{ background: "var(--main-bg)", color: "var(--main-text)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--hover)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CreateChannelModal({ onClose }: { onClose: () => void }) {
  const { uid } = useAuth();
  const { workspace, members } = useWorkspace();
  const router = useRouter();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<ChannelType>("public");
  const [kind, setKind] = useState<ChannelKind>("logs");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!workspace || !uid) return;
    setBusy(true);
    try {
      const cid = await createChannel({
        workspaceId: workspace.id,
        name,
        topic,
        type,
        kind,
        createdBy: uid,
        memberIds: type === "public" ? members.map((m) => m.userId) : [uid],
      });
      onClose();
      router.push(`/workspace/${workspace.slug}/c/${channelSlug(name)}`);
      void cid;
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Create a channel" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="payments"
            className="field"
          />
        </Field>
        <Field label="Topic">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What is this channel for?" className="field" />
        </Field>
        <Field label="Visibility">
          <select value={type} onChange={(e) => setType(e.target.value as ChannelType)} className="field">
            <option value="public">Public — everyone in the workspace</option>
            <option value="private">Private — invite only</option>
          </select>
        </Field>
        <Field label="Kind">
          <select value={kind} onChange={(e) => setKind(e.target.value as ChannelKind)} className="field">
            <option value="logs">Logs — API events land here</option>
            <option value="chat">Chat</option>
            <option value="general">General</option>
          </select>
        </Field>
        <Primary disabled={busy}>{busy ? "Creating…" : "Create"}</Primary>
      </form>
    </Modal>
  );
}

export function InviteModal({ onClose }: { onClose: () => void }) {
  const { uid } = useAuth();
  const { workspace } = useWorkspace();
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);

  async function makeLink(e: FormEvent) {
    e.preventDefault();
    if (!workspace || !uid) return;
    setBusy(true);
    try {
      const { token } = await createInvite({
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        createdBy: uid,
        email: email || null,
      });
      setLink(`${siteUrl()}/invite/${token}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Invite people to this workspace" onClose={onClose}>
      <form onSubmit={makeLink} className="space-y-3">
        <Field label="Email (optional)">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" className="field" />
        </Field>
        <Primary disabled={busy}>{busy ? "Creating…" : "Create invite link"}</Primary>
      </form>
      {link && (
        <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: "var(--hover)" }}>
          <p className="mb-1 text-[12px] text-[var(--main-muted)]">Share this link</p>
          <button
            className="break-all text-left font-mono text-[#1264a3]"
            onClick={() => void navigator.clipboard.writeText(link)}
          >
            {link}
          </button>
        </div>
      )}
    </Modal>
  );
}

export function PreferencesModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfileFields } = useAuth();
  const { mode, setMode } = useTheme();
  const [name, setName] = useState(user?.displayName || "");
  const [busy, setBusy] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProfileFields({ displayName: name, theme: mode });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function onAvatar(file?: File) {
    if (!file) return;
    const res = await uploadToCloudinary(file, "buzq/avatars");
    await updateProfileFields({ photoURL: res.url });
  }

  return (
    <Modal title="Preferences" onClose={onClose}>
      <form onSubmit={save} className="space-y-3">
        <Field label="Display name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" />
        </Field>
        <Field label="Avatar">
          <input type="file" accept="image/*" onChange={(e) => void onAvatar(e.target.files?.[0])} />
        </Field>
        <Field label="Theme">
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMode(t)}
                className="rounded-md border px-3 py-1.5 text-sm capitalize"
                style={{
                  borderColor: mode === t ? "var(--brand)" : "var(--border)",
                  background: mode === t ? "var(--brand-soft)" : "transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Primary disabled={busy}>Save</Primary>
      </form>
    </Modal>
  );
}

export function CreateWorkspaceModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const { workspace } = await createWorkspace({ name, owner: user });
      onClose();
      router.push(`/workspace/${workspace.slug}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Create a workspace" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Workspace name">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme" className="field" />
        </Field>
        <Primary disabled={busy}>{busy ? "Creating…" : "Create workspace"}</Primary>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <div className="mt-1 font-normal">{children}</div>
    </label>
  );
}

function Primary({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-md bg-[#d7263d] py-2 text-sm font-bold text-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}
