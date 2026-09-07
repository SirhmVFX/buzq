"use client";

import { useEffect, useRef, useState } from "react";
import { Hash, Headphones, Lock, Pin, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listenMessages, sendEventMessage, sendMessage, toggleReaction } from "@/lib/db";
import type { Channel, Message } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";
import { Composer } from "./composer";
import { MessageItem } from "./message-item";

export function MessagePane({
  channel,
  onOpenThread,
  onOpenMembers,
}: {
  channel: Channel;
  onOpenThread: (message: Message) => void;
  onOpenMembers: () => void;
}) {
  const { uid } = useAuth();
  const { workspace, memberMap } = useWorkspace();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingTest, setSendingTest] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!workspace) return;
    return listenMessages(workspace.id, channel.id, setMessages);
  }, [workspace, channel.id]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function react(message: Message, emoji: string) {
    if (!workspace || !uid) return;
    await toggleReaction({
      workspaceId: workspace.id,
      channelId: channel.id,
      messageId: message.id,
      emoji,
      userId: uid,
    });
  }

  async function sendTest(status: "success" | "error") {
    if (!workspace || !uid) return;
    setSendingTest(true);
    try {
      await sendEventMessage({
        workspaceId: workspace.id,
        channelId: channel.id,
        userId: uid,
        text:
          status === "success"
            ? "Test event from the workspace. Wiring looks good."
            : "Test failure from the workspace. This is how a broken path looks.",
        event: {
          status,
          event: status === "success" ? "buzq.test_ok" : "buzq.test_fail",
          title: status === "success" ? "Test succeeded" : "Test failed",
          metadata: { channel: channel.slug, sentBy: uid },
          source: "workspace",
        },
      });
    } finally {
      setSendingTest(false);
    }
  }

  const Icon = channel.type === "private" ? Lock : Hash;

  return (
    <div className="flex min-w-0 flex-1 flex-col" style={{ background: "var(--main-bg)" }}>
      <header
        className="flex h-[49px] shrink-0 items-center justify-between border-b px-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1 font-black" style={{ color: "var(--main-text)" }}>
            <Icon className="h-4 w-4 opacity-70" />
            <h1 className="truncate text-[18px] leading-none">{channel.name}</h1>
          </div>
          {channel.topic && (
            <p className="truncate text-[13px] text-[var(--main-muted)]">{channel.topic}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {channel.kind === "logs" && (
            <>
              <button
                disabled={sendingTest}
                onClick={() => void sendTest("success")}
                className="rounded-md px-2 py-1 text-[12px] font-bold text-[#2eb67d] hover:bg-[var(--hover)]"
              >
                Send success
              </button>
              <button
                disabled={sendingTest}
                onClick={() => void sendTest("error")}
                className="rounded-md px-2 py-1 text-[12px] font-bold text-[#e01e5a] hover:bg-[var(--hover)]"
              >
                Send fail
              </button>
            </>
          )}
          <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--hover)]" title="Huddle">
            <Headphones className="h-4 w-4 text-[var(--main-muted)]" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--hover)]" title="Pins">
            <Pin className="h-4 w-4 text-[var(--main-muted)]" />
          </button>
          <button
            onClick={onOpenMembers}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--hover)]"
            title="Members"
          >
            <Users className="h-4 w-4 text-[var(--main-muted)]" />
          </button>
        </div>
      </header>

      <div className="slack-scroll flex-1 overflow-y-auto py-2">
        <div className="px-5 pb-6 pt-8">
          <div
            className="mb-3 grid h-16 w-16 place-items-center rounded-xl text-white"
            style={{ background: "var(--sidebar)" }}
          >
            <Icon className="h-8 w-8" />
          </div>
          <h2 className="text-[28px] font-black tracking-tight" style={{ color: "var(--main-text)" }}>
            {channel.type === "private" ? "🔒" : "#"} {channel.name}
          </h2>
          <p className="mt-1 max-w-xl text-[15px] leading-6 text-[var(--main-muted)]">
            {channel.kind === "logs"
              ? `This is a log stream. Drop Buzq API calls into success and error blocks and they appear here in realtime. Reply in a thread to talk through an incident.`
              : `This is the very beginning of the #${channel.name} channel. ${channel.topic}`}
          </p>
        </div>
        {messages.map((m, i) => (
          <MessageItem
            key={m.id}
            message={m}
            prev={messages[i - 1]}
            member={m.userId ? memberMap[m.userId] : undefined}
            currentUserId={uid || ""}
            onReply={onOpenThread}
            onReact={react}
          />
        ))}
        <div ref={bottom} />
      </div>

      <Composer
        placeholder={`Message #${channel.name}`}
        onSend={async (text, attachments) => {
          if (!workspace || !uid) return;
          await sendMessage({
            workspaceId: workspace.id,
            channelId: channel.id,
            userId: uid,
            text,
            attachments,
          });
        }}
      />
    </div>
  );
}
