"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { listenDMMessages, sendDM, toggleDmReaction } from "@/lib/db";
import type { DirectMessageThread, Message } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";
import { Avatar } from "./avatar";
import { Composer } from "./composer";
import { MessageItem } from "./message-item";

export function DmPane({ dm }: { dm: DirectMessageThread }) {
  const { uid } = useAuth();
  const { workspace, memberMap } = useWorkspace();
  const [messages, setMessages] = useState<Message[]>([]);
  const otherId = dm.participantIds.find((id) => id !== uid) || dm.participantIds[0];
  const other = memberMap[otherId];

  useEffect(() => {
    if (!workspace) return;
    return listenDMMessages(workspace.id, dm.id, setMessages);
  }, [workspace, dm.id]);

  if (!workspace || !uid) return null;

  return (
    <div className="flex min-w-0 flex-1 flex-col" style={{ background: "var(--main-bg)" }}>
      <header
        className="flex h-[49px] items-center gap-2 border-b px-4"
        style={{ borderColor: "var(--border)" }}
      >
        <Avatar name={other?.displayName || "Member"} photoURL={other?.photoURL} size={24} />
        <h1 className="text-[18px] font-black" style={{ color: "var(--main-text)" }}>
          {other?.displayName || "Direct message"}
        </h1>
      </header>
      <div className="slack-scroll flex-1 overflow-y-auto py-2">
        <div className="px-5 pb-6 pt-8">
          <Avatar name={other?.displayName || "Member"} photoURL={other?.photoURL} size={72} />
          <h2 className="mt-3 text-[22px] font-black" style={{ color: "var(--main-text)" }}>
            {other?.displayName}
          </h2>
          <p className="text-[15px] text-[var(--main-muted)]">
            This is the very beginning of your direct message history with {other?.displayName}.
          </p>
        </div>
        {messages.map((m, i) => (
          <MessageItem
            key={m.id}
            message={m}
            prev={messages[i - 1]}
            member={m.userId ? memberMap[m.userId] : undefined}
            currentUserId={uid}
            onReact={(message, emoji) =>
              void toggleDmReaction({
                workspaceId: workspace.id,
                dmId: dm.id,
                messageId: message.id,
                emoji,
                userId: uid,
              })
            }
          />
        ))}
      </div>
      <Composer
        placeholder={`Message ${other?.displayName || ""}`}
        onSend={async (text, attachments) => {
          await sendDM({
            workspaceId: workspace.id,
            dmId: dm.id,
            userId: uid,
            text,
            attachments,
          });
        }}
      />
    </div>
  );
}
