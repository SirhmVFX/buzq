"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Bold, Italic, Link2, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Composer({
  placeholder,
  onSend,
  disabled,
}: {
  placeholder: string;
  onSend: (text: string, attachments: Attachment[]) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  async function submit() {
    const value = text.trim();
    if ((!value && !files.length) || sending || disabled) return;
    setSending(true);
    try {
      await onSend(value, files);
      setText("");
      setFiles([]);
      if (taRef.current) taRef.current.style.height = "auto";
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  }

  function onInput() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setUploading(true);
    try {
      const uploaded: Attachment[] = [];
      for (const file of Array.from(list)) {
        const res = await uploadToCloudinary(file, "buzq/messages");
        uploaded.push({
          url: res.url,
          publicId: res.publicId,
          name: res.originalFilename || file.name,
          type: res.resourceType,
          bytes: res.bytes,
        });
      }
      setFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function wrap(before: string, after = before) {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = end + before.length;
    });
  }

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        void submit();
      }}
      className="composer mx-5 mb-5 rounded-lg border bg-[var(--composer)]"
      style={{ borderColor: "var(--composer-border)" }}
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
          {files.map((f) => (
            <span
              key={f.url}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs"
              style={{ background: "var(--hover)", color: "var(--main-text)" }}
            >
              {f.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" className="h-8 w-8 rounded object-cover" />
              ) : null}
              {f.name}
              <button type="button" onClick={() => setFiles((prev) => prev.filter((x) => x.url !== f.url))}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        onInput={onInput}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="w-full resize-none bg-transparent px-4 pt-3 text-[15px] outline-none placeholder:text-[var(--main-muted)]"
        style={{ color: "var(--main-text)" }}
      />
      <div className="flex items-center justify-between px-2 pb-2 pt-1">
        <div className="flex items-center gap-0.5 text-[var(--main-muted)]">
          <ToolbarBtn onClick={() => wrap("*")} title="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrap("_")} title="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrap("<", ">")} title="Link">
            <Link2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => fileRef.current?.click()} title="Attach">
            <Paperclip className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrap(":")} title="Emoji">
            <Smile className="h-4 w-4" />
          </ToolbarBtn>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            multiple
            onChange={(e) => void onFiles(e.target.files)}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || sending || uploading || (!text.trim() && !files.length)}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-md text-white transition disabled:opacity-40",
            text.trim() || files.length ? "bg-[#d7263d]" : "bg-[#ddd]"
          )}
          aria-label="Send"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function ToolbarBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}
