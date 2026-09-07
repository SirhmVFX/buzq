"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listenReplies, sendReply, toggleReaction } from "@/lib/db";
import type { Message } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";
import { Composer } from "./composer";
import { MessageItem } from "./message-item";

export function ThreadPanel({
  channelId,
  parent,
  onClose,
}: {
  channelId: string;
  parent: Message;
  onClose: () => void;
}) {
  const { uid } = useAuth();
  const { workspace, memberMap } = useWorkspace();
  const [replies, setReplies] = useState<Message[]>([]);

  useEffect(() => {
    if (!workspace) return;
    return listenReplies(workspace.id, channelId, parent.id, setReplies);
  }, [workspace, channelId, parent.id]);

  async function react(message: Message, emoji: string) {
    if (!workspace || !uid) return;
    const isParent = message.id === parent.id;
    await toggleReaction({
      workspaceId: workspace.id,
      channelId,
      messageId: message.id,
      emoji,
      userId: uid,
      threadParentId: isParent ? undefined : parent.id,
    });
  }

  return (
    <aside
      className="flex w-full max-w-[420px] shrink-0 flex-col border-l"
      style={{ background: "var(--main-bg)", borderColor: "var(--border)" }}
    >
      <header
        className="flex h-[49px] items-center justify-between border-b px-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <h2 className="text-[18px] font-black" style={{ color: "var(--main-text)" }}>
            Thread
          </h2>
          <p className="text-[12px] text-[var(--main-muted)]">#{parent.channelId ? "conversation" : "thread"}</p>
        </div>
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--hover)]">
          <X className="h-5 w-5" />
        </button>
      </header>
      <div className="slack-scroll flex-1 overflow-y-auto py-2">
        <MessageItem
          message={parent}
          member={parent.userId ? memberMap[parent.userId] : undefined}
          currentUserId={uid || ""}
          onReact={react}
        />
        {replies.length > 0 && (
          <div className="my-2 flex items-center gap-2 px-5 text-[13px] text-[var(--main-muted)]">
            <span className="font-bold">{replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
            <span className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
        )}
        {replies.map((m, i) => (
          <MessageItem
            key={m.id}
            message={m}
            prev={i === 0 ? parent : replies[i - 1]}
            member={m.userId ? memberMap[m.userId] : undefined}
            currentUserId={uid || ""}
            onReact={react}
            compact
          />
        ))}
      </div>
      <Composer
        placeholder="Reply…"
        onSend={async (text, attachments) => {
          if (!workspace || !uid) return;
          await sendReply({
            workspaceId: workspace.id,
            channelId,
            messageId: parent.id,
            userId: uid,
            text,
            attachments,
          });
        }}
      />
    </aside>
  );
}
