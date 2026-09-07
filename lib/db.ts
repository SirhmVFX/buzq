import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_CHANNELS, channelSlug, generateApiKey, randomToken, sha256Hex, slugify } from "./utils";
import type {
  ApiKeyRecord,
  Attachment,
  Channel,
  ChannelKind,
  ChannelType,
  DirectMessageThread,
  EventPayload,
  Invite,
  MemberRole,
  Message,
  PresenceStatus,
  ThemeMode,
  UserProfile,
  UserWorkspaceLink,
  Workspace,
  WorkspaceMember,
} from "./types";

export const COL = {
  users: "users",
  workspaces: "workspaces",
  invites: "invites",
  apiKeyIndex: "apiKeyIndex",
} as const;

export function newId(path: string) {
  return doc(collection(db, path)).id;
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

export async function createUserProfile(uid: string, data: { email: string; displayName: string; photoURL?: string | null }) {
  const profile: Omit<UserProfile, "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    id: uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL ?? null,
    status: "active",
    theme: "system",
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, COL.users, uid), profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, COL.users, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<UserProfile, "id">) };
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserProfile, "displayName" | "photoURL" | "theme" | "status" | "lastSeenAt">>
) {
  await updateDoc(doc(db, COL.users, uid), {
    ...patch,
    ...(patch.status ? { lastSeenAt: serverTimestamp() } : {}),
  });
}

export function listenUserProfile(uid: string, cb: (user: UserProfile | null) => void): Unsubscribe {
  return onSnapshot(doc(db, COL.users, uid), (snap) => {
    cb(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<UserProfile, "id">) } : null);
  });
}

export async function setPresence(uid: string, status: PresenceStatus) {
  await updateDoc(doc(db, COL.users, uid), {
    status,
    lastSeenAt: serverTimestamp(),
  });
}

export function listenUserWorkspaces(uid: string, cb: (items: UserWorkspaceLink[]) => void): Unsubscribe {
  const q = query(collection(db, COL.users, uid, "workspaces"), orderBy("joinedAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserWorkspaceLink, "id">) })));
  });
}

export async function getWorkspace(id: string): Promise<Workspace | null> {
  const snap = await getDoc(doc(db, COL.workspaces, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Workspace, "id">) };
}

export async function getWorkspaceBySlug(slug: string): Promise<Workspace | null> {
  const q = query(collection(db, COL.workspaces), where("slug", "==", slug), fbLimit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Workspace, "id">) };
}

export function listenWorkspace(id: string, cb: (ws: Workspace | null) => void): Unsubscribe {
  return onSnapshot(doc(db, COL.workspaces, id), (snap) => {
    cb(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Workspace, "id">) } : null);
  });
}

async function uniqueWorkspaceSlug(name: string) {
  let base = slugify(name);
  let slug = base;
  let i = 2;
  while (true) {
    const existing = await getWorkspaceBySlug(slug);
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function createWorkspace(opts: {
  name: string;
  owner: UserProfile;
  slug?: string;
  channelNames?: string[];
}): Promise<{ workspace: Workspace; apiKey: string }> {
  const slug = await uniqueWorkspaceSlug(opts.slug || opts.name);
  const id = newId(COL.workspaces);
  const wsRef = doc(db, COL.workspaces, id);
  await setDoc(wsRef, {
    name: opts.name.trim(),
    slug,
    iconUrl: null,
    ownerId: opts.owner.id,
    plan: "free",
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, COL.workspaces, id, "members", opts.owner.id), {
    workspaceId: id,
    userId: opts.owner.id,
    role: "owner",
    displayName: opts.owner.displayName,
    email: opts.owner.email,
    photoURL: opts.owner.photoURL,
    joinedAt: serverTimestamp(),
  });

  await setDoc(doc(db, COL.users, opts.owner.id, "workspaces", id), {
    name: opts.name.trim(),
    slug,
    iconUrl: null,
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  const selected = new Set(
    opts.channelNames?.length ? ["general", ...opts.channelNames] : DEFAULT_CHANNELS.map((c) => c.name)
  );
  const channels = DEFAULT_CHANNELS.filter((ch) => selected.has(ch.name));
  if (!channels.some((c) => c.name === "general")) {
    const general = DEFAULT_CHANNELS.find((c) => c.name === "general");
    if (general) channels.unshift(general);
  }

  for (const ch of channels) {
    const cid = newId(`${COL.workspaces}/${id}/channels`);
    await setDoc(doc(db, COL.workspaces, id, "channels", cid), {
      workspaceId: id,
      name: ch.name,
      slug: ch.name,
      topic: ch.topic,
      description: "",
      type: "public",
      kind: ch.kind,
      createdBy: opts.owner.id,
      createdAt: serverTimestamp(),
      isArchived: false,
      isDefault: Boolean(ch.isDefault),
    });
    await setDoc(doc(db, COL.workspaces, id, "channels", cid, "members", opts.owner.id), {
      userId: opts.owner.id,
      joinedAt: serverTimestamp(),
    });
  }

  const apiKey = generateApiKey();
  const keyHash = await sha256Hex(apiKey);
  const keyId = newId(`${COL.workspaces}/${id}/apiKeys`);
  await setDoc(doc(db, COL.workspaces, id, "apiKeys", keyId), {
    workspaceId: id,
    name: "Default",
    prefix: apiKey.slice(0, 16),
    keyHash,
    createdBy: opts.owner.id,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, COL.apiKeyIndex, keyHash), {
    workspaceId: id,
    keyId,
  });

  return {
    workspace: {
      id,
      name: opts.name.trim(),
      slug,
      iconUrl: null,
      ownerId: opts.owner.id,
      plan: "free",
      createdAt: Date.now(),
    },
    apiKey,
  };
}

export function listenMembers(workspaceId: string, cb: (members: WorkspaceMember[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COL.workspaces, workspaceId, "members"), (snap) => {
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<WorkspaceMember, "id">),
      }))
    );
  });
}

export function listenChannels(workspaceId: string, cb: (channels: Channel[]) => void): Unsubscribe {
  const q = query(collection(db, COL.workspaces, workspaceId, "channels"), orderBy("name", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Channel, "id">) })));
  });
}

export async function createChannel(opts: {
  workspaceId: string;
  name: string;
  topic?: string;
  type: ChannelType;
  kind: ChannelKind;
  createdBy: string;
  memberIds: string[];
}) {
  const slug = channelSlug(opts.name);
  const cid = newId(`${COL.workspaces}/${opts.workspaceId}/channels`);
  await setDoc(doc(db, COL.workspaces, opts.workspaceId, "channels", cid), {
    workspaceId: opts.workspaceId,
    name: slug,
    slug,
    topic: opts.topic ?? "",
    description: "",
    type: opts.type,
    kind: opts.kind,
    createdBy: opts.createdBy,
    createdAt: serverTimestamp(),
    isArchived: false,
  });
  await Promise.all(
    Array.from(new Set(opts.memberIds)).map((uid) =>
      setDoc(doc(db, COL.workspaces, opts.workspaceId, "channels", cid, "members", uid), {
        userId: uid,
        joinedAt: serverTimestamp(),
      })
    )
  );
  return cid;
}

export async function updateChannel(workspaceId: string, channelId: string, patch: Partial<Pick<Channel, "topic" | "description">>) {
  await updateDoc(doc(db, COL.workspaces, workspaceId, "channels", channelId), patch);
}

export function listenMessages(
  workspaceId: string,
  channelId: string,
  cb: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL.workspaces, workspaceId, "channels", channelId, "messages"),
    orderBy("createdAt", "asc"),
    fbLimit(400)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })));
  });
}

export async function sendMessage(opts: {
  workspaceId: string;
  channelId: string;
  userId: string;
  text: string;
  attachments?: Attachment[];
}) {
  await addDoc(collection(db, COL.workspaces, opts.workspaceId, "channels", opts.channelId, "messages"), {
    workspaceId: opts.workspaceId,
    channelId: opts.channelId,
    type: "message",
    userId: opts.userId,
    text: opts.text,
    replyCount: 0,
    reactions: {},
    attachments: opts.attachments ?? [],
    createdAt: serverTimestamp(),
  });
}

export async function sendEventMessage(opts: {
  workspaceId: string;
  channelId: string;
  text: string;
  event: EventPayload;
  userId?: string | null;
}) {
  await addDoc(collection(db, COL.workspaces, opts.workspaceId, "channels", opts.channelId, "messages"), {
    workspaceId: opts.workspaceId,
    channelId: opts.channelId,
    type: "event",
    userId: opts.userId ?? null,
    text: opts.text,
    event: opts.event,
    replyCount: 0,
    reactions: {},
    attachments: [],
    createdAt: serverTimestamp(),
  });
}

export function listenReplies(
  workspaceId: string,
  channelId: string,
  messageId: string,
  cb: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL.workspaces, workspaceId, "channels", channelId, "messages", messageId, "replies"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })));
  });
}

export async function sendReply(opts: {
  workspaceId: string;
  channelId: string;
  messageId: string;
  userId: string;
  text: string;
  attachments?: Attachment[];
}) {
  const parentRef = doc(db, COL.workspaces, opts.workspaceId, "channels", opts.channelId, "messages", opts.messageId);
  await addDoc(collection(parentRef, "replies"), {
    workspaceId: opts.workspaceId,
    channelId: opts.channelId,
    type: "message",
    userId: opts.userId,
    text: opts.text,
    replyCount: 0,
    reactions: {},
    attachments: opts.attachments ?? [],
    createdAt: serverTimestamp(),
  });
  await updateDoc(parentRef, {
    replyCount: increment(1),
    latestReplyAt: serverTimestamp(),
    latestReplyPreview: opts.text.slice(0, 140),
  });
}

export async function toggleReaction(opts: {
  workspaceId: string;
  channelId: string;
  messageId: string;
  emoji: string;
  userId: string;
  threadParentId?: string;
}) {
  const ref = opts.threadParentId
    ? doc(
        db,
        COL.workspaces,
        opts.workspaceId,
        "channels",
        opts.channelId,
        "messages",
        opts.threadParentId,
        "replies",
        opts.messageId
      )
    : doc(db, COL.workspaces, opts.workspaceId, "channels", opts.channelId, "messages", opts.messageId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const reactions = { ...((snap.data().reactions as Record<string, string[]>) ?? {}) };
  const list = new Set(reactions[opts.emoji] ?? []);
  if (list.has(opts.userId)) list.delete(opts.userId);
  else list.add(opts.userId);
  if (list.size) reactions[opts.emoji] = Array.from(list);
  else delete reactions[opts.emoji];
  await updateDoc(ref, { reactions });
}

export async function toggleDmReaction(opts: {
  workspaceId: string;
  dmId: string;
  messageId: string;
  emoji: string;
  userId: string;
}) {
  const ref = doc(db, COL.workspaces, opts.workspaceId, "dms", opts.dmId, "messages", opts.messageId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const reactions = { ...((snap.data().reactions as Record<string, string[]>) ?? {}) };
  const list = new Set(reactions[opts.emoji] ?? []);
  if (list.has(opts.userId)) list.delete(opts.userId);
  else list.add(opts.userId);
  if (list.size) reactions[opts.emoji] = Array.from(list);
  else delete reactions[opts.emoji];
  await updateDoc(ref, { reactions });
}

export function listenDMs(workspaceId: string, uid: string, cb: (dms: DirectMessageThread[]) => void): Unsubscribe {
  const q = query(
    collection(db, COL.workspaces, workspaceId, "dms"),
    where("participantIds", "array-contains", uid)
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DirectMessageThread, "id">) }));
    items.sort((a, b) => {
      const am = a.lastMessageAt ? 1 : 0;
      const bm = b.lastMessageAt ? 1 : 0;
      return bm - am;
    });
    cb(items);
  });
}

export async function getOrCreateDM(workspaceId: string, a: string, b: string) {
  const [x, y] = [a, b].sort();
  const id = `${x}_${y}`;
  const ref = doc(db, COL.workspaces, workspaceId, "dms", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      workspaceId,
      participantIds: [x, y],
      lastMessageAt: serverTimestamp(),
      lastMessagePreview: "",
    });
  }
  return id;
}

export function listenDMMessages(workspaceId: string, dmId: string, cb: (messages: Message[]) => void): Unsubscribe {
  const q = query(
    collection(db, COL.workspaces, workspaceId, "dms", dmId, "messages"),
    orderBy("createdAt", "asc"),
    fbLimit(400)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })));
  });
}

export async function sendDM(opts: {
  workspaceId: string;
  dmId: string;
  userId: string;
  text: string;
  attachments?: Attachment[];
}) {
  await addDoc(collection(db, COL.workspaces, opts.workspaceId, "dms", opts.dmId, "messages"), {
    workspaceId: opts.workspaceId,
    channelId: opts.dmId,
    type: "message",
    userId: opts.userId,
    text: opts.text,
    replyCount: 0,
    reactions: {},
    attachments: opts.attachments ?? [],
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, COL.workspaces, opts.workspaceId, "dms", opts.dmId), {
    lastMessageAt: serverTimestamp(),
    lastMessagePreview: opts.text.slice(0, 140),
  });
}

export async function createInvite(opts: {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  createdBy: string;
  email?: string | null;
  role?: MemberRole;
  channelId?: string;
}) {
  const token = randomToken(20);
  const ref = await addDoc(collection(db, COL.invites), {
    workspaceId: opts.workspaceId,
    workspaceName: opts.workspaceName,
    workspaceSlug: opts.workspaceSlug,
    channelId: opts.channelId ?? null,
    email: opts.email?.trim().toLowerCase() || null,
    token,
    role: opts.role ?? "member",
    createdBy: opts.createdBy,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });
  return { id: ref.id, token };
}

export async function getInviteByToken(token: string): Promise<(Invite & { id: string }) | null> {
  const q = query(collection(db, COL.invites), where("token", "==", token), fbLimit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Invite, "id">) };
}

export async function acceptInvite(invite: Invite & { id: string }, user: UserProfile) {
  const memberRef = doc(db, COL.workspaces, invite.workspaceId, "members", user.id);
  const existing = await getDoc(memberRef);
  if (!existing.exists()) {
    await setDoc(memberRef, {
      workspaceId: invite.workspaceId,
      userId: user.id,
      role: invite.role,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      joinedAt: serverTimestamp(),
    });
    await setDoc(doc(db, COL.users, user.id, "workspaces", invite.workspaceId), {
      name: invite.workspaceName,
      slug: invite.workspaceSlug,
      iconUrl: null,
      role: invite.role,
      joinedAt: serverTimestamp(),
    });
  }
  if (invite.channelId) {
    await setDoc(doc(db, COL.workspaces, invite.workspaceId, "channels", invite.channelId, "members", user.id), {
      userId: user.id,
      joinedAt: serverTimestamp(),
    });
  }
  await updateDoc(doc(db, COL.invites, invite.id), { usedAt: serverTimestamp() });
}

export function listenApiKeys(workspaceId: string, cb: (keys: ApiKeyRecord[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COL.workspaces, workspaceId, "apiKeys"), (snap) => {
    const keys = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<ApiKeyRecord, "id">) }))
      .filter((k) => !k.revokedAt);
    cb(keys);
  });
}

export async function createApiKey(workspaceId: string, name: string, createdBy: string) {
  const apiKey = generateApiKey();
  const keyHash = await sha256Hex(apiKey);
  const keyId = newId(`${COL.workspaces}/${workspaceId}/apiKeys`);
  await setDoc(doc(db, COL.workspaces, workspaceId, "apiKeys", keyId), {
    workspaceId,
    name,
    prefix: apiKey.slice(0, 16),
    keyHash,
    createdBy,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, COL.apiKeyIndex, keyHash), { workspaceId, keyId });
  return apiKey;
}

export async function revokeApiKey(workspaceId: string, keyId: string, keyHash: string) {
  await updateDoc(doc(db, COL.workspaces, workspaceId, "apiKeys", keyId), {
    revokedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, COL.apiKeyIndex, keyHash), { revoked: true });
}

export async function findChannelBySlug(workspaceId: string, slug: string): Promise<Channel | null> {
  const q = query(
    collection(db, COL.workspaces, workspaceId, "channels"),
    where("slug", "==", slug),
    fbLimit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Channel, "id">) };
}

export { stripUndefined };
