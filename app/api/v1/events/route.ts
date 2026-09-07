import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminConfigured, adminDb } from "@/lib/firebase-admin";
import type { EventStatus } from "@/lib/types";

const STATUSES: EventStatus[] = ["success", "error", "warning", "info"];

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return cors(
      NextResponse.json(
        {
          error:
            "Ingest is not configured. Add Firebase Admin env vars so API keys can write events without a user session.",
        },
        { status: 503 }
      )
    );
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token.startsWith("bzq_live_")) {
    return cors(NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 }));
  }

  const keyHash = crypto.createHash("sha256").update(token).digest("hex");
  const firestore = adminDb();
  const indexSnap = await firestore.doc(`apiKeyIndex/${keyHash}`).get();
  if (!indexSnap.exists || indexSnap.data()?.revoked) {
    return cors(NextResponse.json({ error: "Unknown or revoked API key" }, { status: 401 }));
  }

  const { workspaceId, keyId } = indexSnap.data() as { workspaceId: string; keyId: string };

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return cors(NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }));
  }

  const channelSlug = String(body.channel || "").trim().toLowerCase().replace(/^#/, "");
  const status = String(body.status || "").toLowerCase() as EventStatus;
  const event = String(body.event || "").trim();
  const title = String(body.title || event || "Event").trim();
  const message = String(body.message || title).trim();
  const metadata = body.metadata && typeof body.metadata === "object" ? (body.metadata as Record<string, unknown>) : {};
  const source = typeof body.source === "string" ? body.source : undefined;

  if (!channelSlug) {
    return cors(NextResponse.json({ error: "channel is required (e.g. payments, signups, errors)" }, { status: 400 }));
  }
  if (!STATUSES.includes(status)) {
    return cors(
      NextResponse.json({ error: "status must be one of success, error, warning, info" }, { status: 400 })
    );
  }
  if (!event) {
    return cors(NextResponse.json({ error: "event is required (e.g. payment.failed)" }, { status: 400 }));
  }

  const channels = await firestore
    .collection(`workspaces/${workspaceId}/channels`)
    .where("slug", "==", channelSlug)
    .limit(1)
    .get();

  if (channels.empty) {
    return cors(
      NextResponse.json(
        { error: `Channel #${channelSlug} was not found in this workspace` },
        { status: 404 }
      )
    );
  }

  const channelId = channels.docs[0].id;
  const docRef = await firestore.collection(`workspaces/${workspaceId}/channels/${channelId}/messages`).add({
    workspaceId,
    channelId,
    type: "event",
    userId: null,
    text: message,
    event: { status, event, title, metadata, source },
    replyCount: 0,
    reactions: {},
    attachments: [],
    createdAt: new Date(),
  });

  await firestore.doc(`workspaces/${workspaceId}/apiKeys/${keyId}`).update({
    lastUsedAt: new Date(),
  });

  return cors(
    NextResponse.json({
      ok: true,
      id: docRef.id,
      channel: channelSlug,
      status,
    })
  );
}
