export type ThemeMode = "light" | "dark" | "system";
export type PresenceStatus = "active" | "away" | "dnd" | "offline";
export type MemberRole = "owner" | "admin" | "member";
export type ChannelType = "public" | "private";
export type ChannelKind = "logs" | "chat" | "general";
export type MessageType = "event" | "message" | "system";
export type EventStatus = "success" | "error" | "warning" | "info";

export type FirestoreDate =
  | Date
  | { seconds: number; nanoseconds?: number; toMillis?: () => number }
  | number
  | string
  | null;

export interface Attachment {
  url: string;
  publicId?: string;
  name: string;
  type: string;
  bytes?: number;
}

export interface EventPayload {
  status: EventStatus;
  event: string;
  title: string;
  metadata?: Record<string, unknown>;
  source?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  status: PresenceStatus;
  theme: ThemeMode;
  createdAt: FirestoreDate;
  lastSeenAt?: FirestoreDate;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  ownerId: string;
  plan: "free" | "team" | "scale";
  createdAt: FirestoreDate;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: MemberRole;
  displayName: string;
  email: string;
  photoURL: string | null;
  joinedAt: FirestoreDate;
}

export interface UserWorkspaceLink {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  role: MemberRole;
  joinedAt: FirestoreDate;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  topic: string;
  description: string;
  type: ChannelType;
  kind: ChannelKind;
  createdBy: string;
  createdAt: FirestoreDate;
  isArchived: boolean;
  isDefault?: boolean;
}

export interface ChannelMember {
  id: string;
  userId: string;
  joinedAt: FirestoreDate;
}

export interface Message {
  id: string;
  workspaceId: string;
  channelId: string;
  type: MessageType;
  userId: string | null;
  text: string;
  event?: EventPayload;
  replyCount: number;
  latestReplyAt?: FirestoreDate;
  latestReplyPreview?: string;
  reactions: Record<string, string[]>;
  attachments: Attachment[];
  createdAt: FirestoreDate;
  editedAt?: FirestoreDate;
}

export interface DirectMessageThread {
  id: string;
  workspaceId: string;
  participantIds: string[];
  lastMessageAt?: FirestoreDate;
  lastMessagePreview?: string;
}

export interface Invite {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  channelId?: string;
  email: string | null;
  token: string;
  role: MemberRole;
  createdBy: string;
  createdAt: FirestoreDate;
  expiresAt: FirestoreDate;
  usedAt?: FirestoreDate;
}

export interface ApiKeyRecord {
  id: string;
  workspaceId: string;
  name: string;
  prefix: string;
  keyHash: string;
  createdBy: string;
  createdAt: FirestoreDate;
  lastUsedAt?: FirestoreDate;
  revokedAt?: FirestoreDate;
}
