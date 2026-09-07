"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquareText, MoreHorizontal, Plus, Smile } from "lucide-react";
import type { Attachment, Message, WorkspaceMember } from "@/lib/types";
import { EVENT_STATUS, QUICK_REACTIONS, cn, dayKey, formatDateLabel, formatTime, isSameUserBurst } from "@/lib/utils";
import { useOptionalWorkspace } from "@/lib/workspace-context";
import { Avatar } from "./avatar";

function renderText(text: string) {
  const parts = text.split(/(\*[^*]+\*|_[^_]+_|`[^`]+`|https?:\/\/\S+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded px-1 py-0.5 font-mono text-[12.5px]" style={{ background: "var(--hover)", color: "var(--brand)" }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer" className="text-[#1264a3] underline">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function Attachments({ items }: { items: Attachment[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((a) =>
        a.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={a.url} src={a.url} alt={a.name} className="max-h-56 max-w-xs rounded-lg border" style={{ borderColor: "var(--border)" }} />
        ) : (
          <a key={a.url} href={a.url} target="_blank" rel="noreferrer" className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--main-text)" }}>
            {a.name}
          </a>
        )
      )}
    </div>
  );
}

export function MessageItem({
  message,
  prev,
  member,
  currentUserId,
  onReply,
  onReact,
  compact,
}: {
  message: Message;
  prev?: Message;
  member?: WorkspaceMember;
  currentUserId: string;
  onReply?: (message: Message) => void;
  onReact: (message: Message, emoji: string) => void;
  compact?: boolean;
}) {
  const [picker, setPicker] = useState(false);
  const grouped =
    !compact &&
    message.type === "message" &&
    prev?.type === "message" &&
    isSameUserBurst(prev.userId, prev.createdAt, message.userId, message.createdAt);
  const name = member?.displayName || (message.userId ? "Member" : "Buzq");
  const showDay = !prev || dayKey(prev.createdAt) !== dayKey(message.createdAt);

  return (
    <>
      {showDay && (
        <div className="relative my-3 flex items-center px-5">
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span className="mx-3 rounded-full border px-3 py-0.5 text-[13px] font-bold" style={{ borderColor: "var(--border)", color: "var(--main-text)", background: "var(--main-bg)" }}>
            {formatDateLabel(message.createdAt)}
          </span>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>
      )}

      {message.type === "event" && message.event ? (
        <EventCard message={message} onReply={onReply} onReact={onReact} currentUserId={currentUserId} />
      ) : (
        <div className={cn("msg-row group relative flex gap-2 px-5 hover:bg-[var(--hover)]", grouped ? "py-0.5" : "py-2")}>
          <div className="w-9 shrink-0">
            {grouped ? (
              <span className="mt-1 hidden w-full text-right text-[11px] text-[var(--main-muted)] group-hover:block">{formatTime(message.createdAt)}</span>
            ) : (
              <Avatar name={name} photoURL={member?.photoURL} size={36} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {!grouped && (
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-black" style={{ color: "var(--main-text)" }}>{name}</span>
                <span className="text-xs text-[var(--main-muted)]">{formatTime(message.createdAt)}</span>
              </div>
            )}
            <p className="whitespace-pre-wrap text-[15px] leading-6" style={{ color: "var(--main-text)" }}>
              {renderText(message.text)}
            </p>
            <Attachments items={message.attachments} />
            <ReactionRow
              reactions={message.reactions}
              currentUserId={currentUserId}
              onPick={(e) => onReact(message, e)}
              onOpenPicker={() => setPicker(true)}
            />
            {!!message.replyCount && onReply && (
              <button onClick={() => onReply(message)} className="mt-1 text-[13px] font-bold text-[#1264a3] hover:underline">
                {message.replyCount} {message.replyCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
          <HoverBar
            picker={picker}
            setPicker={setPicker}
            onReply={onReply ? () => onReply(message) : undefined}
            onReact={(e) => {
              onReact(message, e);
              setPicker(false);
            }}
          />
        </div>
      )}
    </>
  );
}

function EventCard({
  message,
  onReply,
  onReact,
  currentUserId,
}: {
  message: Message;
  onReply?: (message: Message) => void;
  onReact: (message: Message, emoji: string) => void;
  currentUserId: string;
}) {
  const [picker, setPicker] = useState(false);
  const event = message.event!;
  const meta = EVENT_STATUS[event.status];
  const entries = event.metadata ? Object.entries(event.metadata).slice(0, 8) : [];

  return (
    <div className="msg-row group relative px-5 py-2 hover:bg-[var(--hover)]">
      <div className="rounded-lg border bg-[var(--main-bg)] p-3 shadow-[var(--shadow)]" style={{ borderColor: "var(--border)", borderLeftWidth: 4, borderLeftColor: meta.color }}>
        <div className="flex items-center gap-2">
          <span className="rounded px-1.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-white" style={{ background: meta.color }}>
            {meta.label}
          </span>
          <span className="text-[13px] font-mono text-[var(--main-muted)]">{event.event}</span>
          <span className="ml-auto text-xs text-[var(--main-muted)]">{formatTime(message.createdAt)}</span>
        </div>
        <h3 className="mt-1.5 text-[15px] font-black" style={{ color: "var(--main-text)" }}>{event.title}</h3>
        <p className="mt-0.5 whitespace-pre-wrap text-[14.5px] leading-6" style={{ color: "var(--main-text)" }}>
          {renderText(message.text)}
        </p>
        {entries.length > 0 && (
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md px-2 py-1.5 text-[12.5px] font-mono" style={{ background: "var(--hover)" }}>
            {entries.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-[var(--main-muted)]">{k}</dt>
                <dd style={{ color: "var(--main-text)" }}>{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
        <ReactionRow
          reactions={message.reactions}
          currentUserId={currentUserId}
          onPick={(e) => onReact(message, e)}
          onOpenPicker={() => setPicker(true)}
        />
        {onReply && (
          <button onClick={() => onReply(message)} className="mt-2 text-[13px] font-bold text-[#1264a3] hover:underline">
            {message.replyCount ? `${message.replyCount} ${message.replyCount === 1 ? "reply" : "replies"} · ` : ""}
            Reply in thread
          </button>
        )}
      </div>
      <HoverBar
        picker={picker}
        setPicker={setPicker}
        onReply={onReply ? () => onReply(message) : undefined}
        onReact={(e) => {
          onReact(message, e);
          setPicker(false);
        }}
      />
    </div>
  );
}

function reactionLabel(ids: string[], currentUserId: string, memberMap?: Record<string, WorkspaceMember>) {
  return ids
    .map((id) => (id === currentUserId ? "you" : memberMap?.[id]?.displayName || "Member"))
    .join(", ");
}

function ReactionRow({
  reactions,
  currentUserId,
  onPick,
  onOpenPicker,
}: {
  reactions: Record<string, string[]>;
  currentUserId: string;
  onPick: (emoji: string) => void;
  onOpenPicker: () => void;
}) {
  const ws = useOptionalWorkspace();
  const keys = Object.keys(reactions || {}).filter((k) => reactions[k]?.length);
  if (!keys.length) return null;
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1">
      {keys.map((emoji) => {
        const users = reactions[emoji];
        const mine = users.includes(currentUserId);
        const who = reactionLabel(users, currentUserId, ws?.memberMap);
        return (
          <button
            key={emoji}
            title={who}
            onClick={() => onPick(emoji)}
            className="react-pop inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[13px] transition hover:scale-105"
            style={{
              borderColor: mine ? "var(--brand)" : "var(--border)",
              background: mine ? "var(--brand-soft)" : "var(--main-bg)",
            }}
          >
            <span>{emoji}</span>
            <span className="text-[12px] font-bold">{users.length}</span>
          </button>
        );
      })}
      <button
        onClick={onOpenPicker}
        className="grid h-6 w-6 place-items-center rounded-full border text-[var(--main-muted)] hover:bg-[var(--hover)]"
        style={{ borderColor: "var(--border)" }}
        title="Add reaction"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function HoverBar({
  picker,
  setPicker,
  onReply,
  onReact,
}: {
  picker: boolean;
  setPicker: (v: boolean) => void;
  onReply?: () => void;
  onReact: (emoji: string) => void;
}) {
  return (
    <div className="msg-actions absolute -top-3 right-8 z-20 flex rounded-lg border bg-[var(--main-bg)] shadow-[var(--shadow)]" style={{ borderColor: "var(--border)" }}>
      {["👍", "👀", "✅"].map((e) => (
        <button key={e} className="grid h-8 w-8 place-items-center text-base hover:bg-[var(--hover)]" title={`React ${e}`} onClick={() => onReact(e)}>
          {e}
        </button>
      ))}
      <button className="grid h-8 w-8 place-items-center hover:bg-[var(--hover)]" title="Add reaction" onClick={() => setPicker(!picker)}>
        <Smile className="h-4 w-4" />
      </button>
      {onReply && (
        <button className="grid h-8 w-8 place-items-center hover:bg-[var(--hover)]" title="Reply in thread" onClick={onReply}>
          <MessageSquareText className="h-4 w-4" />
        </button>
      )}
      <button className="grid h-8 w-8 place-items-center hover:bg-[var(--hover)]" title="More">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {picker && <EmojiPicker onPick={onReact} onClose={() => setPicker(false)} />}
    </div>
  );
}

function EmojiPicker({ onPick, onClose }: { onPick: (emoji: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);
  return (
    <div ref={ref} className="mega-in absolute right-0 top-9 z-30 w-[280px] rounded-xl border bg-[var(--main-bg)] p-2 shadow-[var(--shadow)]" style={{ borderColor: "var(--border)" }}>
      <p className="px-1 pb-1 text-[11px] font-black uppercase tracking-wide text-[var(--main-muted)]">Add a reaction</p>
      <div className="grid grid-cols-8 gap-0.5">
        {QUICK_REACTIONS.map((e) => (
          <button key={e} className="grid h-8 w-8 place-items-center rounded-md text-lg transition hover:scale-110 hover:bg-[var(--hover)]" onClick={() => onPick(e)}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
