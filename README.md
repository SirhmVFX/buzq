# Buzq

Realtime product pulse. Drop an API call into a **success** block and an **unsuccessful** block. Events land in Slack-like channels. Your team replies in threads, chats in the stream, and DMs each other — without waiting for a dashboard.

Brand color: `#d7263d`. Light and dark mode throughout.

## What this is

Startups, developers, and operators often only find out that signup, payments, or a critical path is broken when a customer complains. The code already knew — the `catch` already ran. Buzq turns that moment into a chat message.

```
your app  --POST /api/v1/events-->  Firebase  --live snapshot-->  Slack-like workspace
```

## Stack

| Piece | Why |
| --- | --- |
| **Next.js 16** (App Router) | Marketing pages for SEO + the authenticated workspace |
| **Firebase Auth** | Email/password and Google |
| **Cloud Firestore** | Workspaces, channels, messages, threads, DMs, invites, hashed API keys — all realtime via `onSnapshot` |
| **Firebase Admin** | Ingest API writes events with an API key (no user session) |
| **Cloudinary** | Avatars and message attachments |
| **Tailwind v4** | Slack-like shell + marketing |

## Local setup

1. Copy `.env.example` to `.env.local` and fill in Firebase + Cloudinary.
2. In Firebase Console:
   - Enable **Authentication → Email/Password** (and Google if you want).
   - Create a Firestore database.
   - Deploy `firestore.rules` (and indexes if the console asks).
3. For Cloudinary, set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and either an unsigned `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` or `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` for signed uploads.
4. For the public ingest API (calls from *your product*, not the test buttons), add a service account:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY` (keep the `\n` escapes)
5. Run the app:

```bash
cd buzq
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product flow

1. **Sign up** → **Onboarding** creates a workspace plus default channels: `#general`, `#signups`, `#payments`, `#errors`, `#deployments`, `#random`.
2. You get an API key (`bzq_live_…`) shown once. The SHA-256 hash is stored; the plaintext is not.
3. From your product:

```js
try {
  await charge(user)
  await fetch("https://YOUR_DOMAIN/api/v1/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BUZQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: "payments",
      status: "success",
      event: "payment.succeeded",
      title: "Payment succeeded",
      message: `${user.email} paid $49`,
      metadata: { amount: 4900 },
    }),
  })
} catch (err) {
  await fetch("https://YOUR_DOMAIN/api/v1/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BUZQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: "payments",
      status: "error",
      event: "payment.failed",
      title: "Payment failed",
      message: err.message,
    }),
  })
  throw err
}
```

4. The card appears in `#payments`. Anyone in the workspace can **reply in a thread**, react, or chat in the channel. Invite people from the workspace menu. DMs are in the sidebar.

Without Admin credentials you can still demo: open a logs channel and use **Send success** / **Send fail** (writes as the signed-in user).

## Data model (Firestore)

- `users/{uid}` — profile, theme, presence  
- `users/{uid}/workspaces/{wid}` — list of workspaces for the sidebar rail  
- `workspaces/{wid}` — name, slug, owner  
- `workspaces/{wid}/members/{uid}` — role  
- `workspaces/{wid}/channels/{cid}/messages/{mid}` — chat + event cards  
- `.../messages/{mid}/replies/{rid}` — Slack-style threads  
- `workspaces/{wid}/dms/{a_b}/messages` — direct messages  
- `invites/{id}` — token links  
- `apiKeyIndex/{sha256}` — ingest lookup  

## UI notes

The workspace copies Slack’s layout on purpose: 70px rail, ~260px channel sidebar in brand red, main pane, optional right thread. Composer is Enter-to-send, Shift+Enter for a new line. Theme is stored in `localStorage` (`buzq-theme`) and applied before paint to avoid a flash.

## Marketing / SEO

Static pages under `app/` (features, how-it-works, use cases, blog, docs, compare, etc.) plus `sitemap.ts` and `robots.ts`. Unique copy lives in `lib/content.ts`.
