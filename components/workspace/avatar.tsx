"use client";

import { avatarColor, initials } from "@/lib/utils";

export function Avatar({
  name,
  photoURL,
  size = 36,
  presence,
}: {
  name: string;
  photoURL?: string | null;
  size?: number;
  presence?: "active" | "away" | "dnd" | "offline";
}) {
  const color = avatarColor(name || "?");
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoURL}
          alt=""
          className="h-full w-full rounded-[6px] object-cover"
        />
      ) : (
        <span
          className="grid h-full w-full place-items-center rounded-[6px] text-[11px] font-bold text-white"
          style={{ background: color, fontSize: Math.max(10, size * 0.32) }}
        >
          {initials(name)}
        </span>
      )}
      {presence && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2"
          style={{
            background:
              presence === "active" ? "#2eb67d" : presence === "dnd" ? "#e01e5a" : presence === "away" ? "#ecb22e" : "#9a9b9e",
            borderColor: "var(--sidebar)",
          }}
        />
      )}
    </span>
  );
}
