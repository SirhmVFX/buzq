import type { FirestoreDate } from "./types";

export const BRAND = "#d7263d";

export const DEFAULT_CHANNELS: {
  name: string;
  topic: string;
  kind: "logs" | "chat" | "general";
  isDefault?: boolean;
}[] = [
  {
    name: "general",
    topic: "Team-wide chat. Wins, questions, and the everyday stream.",
    kind: "general",
    isDefault: true,
  },
  {
    name: "signups",
    topic: "New users, incomplete registrations, and auth failures.",
    kind: "logs",
  },
  {
    name: "payments",
    topic: "Charges, refunds, declined cards, and billing errors.",
    kind: "logs",
  },
  {
    name: "errors",
    topic: "Unhandled exceptions and failed code paths from your product.",
    kind: "logs",
  },
  {
    name: "deployments",
    topic: "Releases, rollbacks, and environment health.",
    kind: "logs",
  },
  {
    name: "random",
    topic: "Off-topic, memes, and the stuff that keeps a team human.",
    kind: "chat",
  },
];

export const EVENT_STATUS = {
  success: { label: "Success", color: "#2eb67d" },
  error: { label: "Error", color: "#e01e5a" },
  warning: { label: "Warning", color: "#ecb22e" },
  info: { label: "Info", color: "#1d9bd1" },
} as const;

export const QUICK_REACTIONS = [
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🎉",
  "✅",
  "❌",
  "👀",
  "🚨",
  "😄",
  "😮",
  "😢",
  "🙌",
  "💯",
  "🙏",
  "👏",
  "🚀",
  "💡",
  "⚠️",
  "🐛",
];

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return s || "workspace";
}

export function channelSlug(input: string) {
  return slugify(input).replace(/^-/, "");
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function toMillis(value: FirestoreDate | undefined): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Date.parse(value);
    return Number.isNaN(n) ? 0 : n;
  }
  if (value instanceof Date) return value.getTime();
  if (typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }
  if (typeof value === "object" && "seconds" in value) {
    return value.seconds * 1000 + Math.floor((value.nanoseconds ?? 0) / 1e6);
  }
  return 0;
}

export function formatTime(value: FirestoreDate | undefined) {
  const ms = toMillis(value);
  if (!ms) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function formatDateLabel(value: FirestoreDate | undefined) {
  const ms = toMillis(value);
  if (!ms) return "";
  const d = new Date(ms);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function dayKey(value: FirestoreDate | undefined) {
  const ms = toMillis(value);
  if (!ms) return "";
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function avatarColor(seed: string) {
  const palette = [
    "#d7263d",
    "#e01e5a",
    "#2eb67d",
    "#ecb22e",
    "#1d9bd1",
    "#e51670",
    "#1264a3",
    "#9b59b6",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function randomToken(bytes = 18) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(value: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateApiKey() {
  const raw = randomToken(24);
  return `bzq_live_${raw}`;
}

export function isSameUserBurst(prevUserId: string | null, prevAt: FirestoreDate | undefined, userId: string | null, at: FirestoreDate | undefined) {
  if (!prevUserId || !userId || prevUserId !== userId) return false;
  const delta = toMillis(at) - toMillis(prevAt);
  return delta >= 0 && delta < 5 * 60 * 1000;
}
