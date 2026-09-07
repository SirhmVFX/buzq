export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "per workspace / month",
    blurb: "Wire your first product and see events land.",
    cta: "Get started",
    href: "/signup",
    features: ["1 workspace", "6 default channels", "7-day history", "1 API key", "Threads & reactions", "DMs"],
    missing: ["Unlimited history", "Guest invites", "Priority ingest"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per user / month",
    blurb: "For small teams watching one product.",
    cta: "Get started",
    href: "/signup",
    features: ["Unlimited channels", "90-day history", "3 API keys", "Workspace invites", "Threads, reactions, DMs", "Test events"],
    missing: ["SSO", "Audit log"],
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    period: "per user / month",
    blurb: "The whole company in the loop.",
    cta: "Get started",
    href: "/signup",
    featured: true,
    badge: "Best value",
    features: ["Unlimited history", "Unlimited channels", "5 API keys", "Private channels", "Priority ingest", "Email support"],
    missing: [],
  },
  {
    id: "scale",
    name: "Scale",
    price: "Custom",
    period: "talk to us",
    blurb: "Volume, SSO, and an ops-grade ingest path.",
    cta: "Contact sales",
    href: "/contact",
    features: ["Everything in Team", "SSO-ready", "Audit-friendly keys", "Dedicated channels per service", "SLA support"],
    missing: [],
  },
];

export const COMPARE_ROWS: { group: string; rows: { name: string; hint: string; values: [string, string, string, string] }[] }[] = [
  {
    group: "Product pulse",
    rows: [
      { name: "Event ingest API", hint: "POST success and failure from any backend", values: ["✓", "✓", "✓", "✓"] },
      { name: "Log channels", hint: "#signups, #payments, #errors, custom", values: ["6", "Unlimited", "Unlimited", "Unlimited"] },
      { name: "Message history", hint: "How far back the stream keeps", values: ["7 days", "90 days", "Unlimited", "Unlimited"] },
      { name: "Thread replies", hint: "Incident rooms under an event", values: ["✓", "✓", "✓", "✓"] },
      { name: "Emoji reactions", hint: "Slack-style react on any message", values: ["✓", "✓", "✓", "✓"] },
      { name: "Direct messages", hint: "1:1 chat in the workspace", values: ["✓", "✓", "✓", "✓"] },
    ],
  },
  {
    group: "Team & access",
    rows: [
      { name: "Workspace members", hint: "People you invite in", values: ["10", "50", "Unlimited", "Unlimited"] },
      { name: "Workspace invites", hint: "Link or email", values: ["✓", "✓", "✓", "✓"] },
      { name: "Private channels", hint: "Invite-only log streams", values: ["—", "✓", "✓", "✓"] },
      { name: "API keys", hint: "Hashed, rotatable", values: ["1", "3", "5", "Unlimited"] },
    ],
  },
  {
    group: "Scale & trust",
    rows: [
      { name: "Priority ingest", hint: "Faster writes at volume", values: ["—", "—", "✓", "✓"] },
      { name: "SSO-ready", hint: "SAML / OIDC when you need it", values: ["—", "—", "—", "✓"] },
      { name: "Audit-friendly keys", hint: "Last used, revoke, named keys", values: ["—", "✓", "✓", "✓"] },
      { name: "Support", hint: "How we show up", values: ["Docs", "Email", "Email", "SLA"] },
    ],
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  read: string;
  tags: string[];
  body: string[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "why-startups-miss-broken-payments",
    title: "Why startups miss broken payments for days",
    description: "The charge succeeded in staging and failed in production. Nobody was watching the catch block.",
    date: "2026-08-12",
    read: "6 min",
    tags: ["payments", "startups"],
    body: [
      "Most payment bugs are not mysterious. A webhook retries, a card is declined, a customer never reaches the success page. The code already knows. The catch block already ran. The company just was not in the room.",
      "Buzq exists because that room should look like Slack. When a charge fails, it should land in #payments with a title, a status, and a thread your CEO can actually read. When it succeeds, that should land too — otherwise you only ever train the team to dread the channel.",
      "Instrument both paths. A successful signup is as useful as a failed one. Incomplete registrations tell you where the funnel leaks. Failed payments tell you where revenue leaks. Put the API call next to the code that already knows, and stop finding out on Monday.",
    ],
  },
  {
    slug: "from-sentry-noise-to-ops-chat",
    title: "From Sentry noise to ops chat your CEO will open",
    description: "Error trackers are for stack traces. Product pulse is for people.",
    date: "2026-08-21",
    read: "7 min",
    tags: ["observability", "leadership"],
    body: [
      "Sentry, LogRocket, and Datadog are excellent at telling engineers what blew up. They are terrible at telling a founder that three customers could not finish checkout before a demo.",
      "The missing layer is conversational. Events need a channel, a status color, and a thread. Non-engineers need to reply “is this the Stripe outage or us?” without learning a query language.",
      "Keep your APM. Add a human stream on top. Buzq is that stream: the same muscle memory as Slack, pointed at the moments your product already knows about.",
    ],
  },
  {
    slug: "instrument-the-signup-funnel",
    title: "Instrument the signup funnel in one afternoon",
    description: "Success, incomplete, and failed registration — three events, three truths.",
    date: "2026-08-28",
    read: "5 min",
    tags: ["auth", "developers"],
    body: [
      "A signup is not a boolean. People start, stall on email verify, bounce on password rules, or get a 500 from your identity provider.",
      "Put Buzq in three places: the success return, the early-return that means “they did not finish”, and the catch. Route them all to #signups. Your growth person will live there.",
      "Do not wait for a full analytics pipeline. If the code path already ran, the notification can already exist.",
    ],
  },
  {
    slug: "get-the-whole-company-in-the-loop",
    title: "Get the whole company in the loop without another stand-up",
    description: "Invites, channels, and threads turn incidents into conversations.",
    date: "2026-09-02",
    read: "5 min",
    tags: ["teams", "culture"],
    body: [
      "The reason Slack won at work is not emoji. It is channels plus threads. Buzq copies that on purpose.",
      "Invite the CEO to the workspace, invite support to #payments, keep #errors for engineering. When a notification lands, the thread is the incident room. No new tool to learn.",
      "Direct messages still exist for the quiet “is this us?” ping. The stream stays public enough that the company stops being surprised.",
    ],
  },
  {
    slug: "event-driven-observability-for-humans",
    title: "Event-driven observability for humans",
    description: "You do not need another dashboard. You need a room.",
    date: "2026-09-05",
    read: "8 min",
    tags: ["observability"],
    body: [
      "Dashboards go stale because they ask people to visit. Chat does not. Chat interrupts with a sentence.",
      "An event with a status, a title, and metadata is a sentence. A thread is the discussion. A channel is the archive. That is enough observability for most product questions.",
      "Buzq is opinionated: one POST from your backend, one message in a channel, optional thread. Firebase keeps it realtime. Cloudinary keeps avatars and attachments out of your disk.",
    ],
  },
];

export const USE_CASES = [
  {
    slug: "startups",
    title: "For startups",
    lede: "Five people, one product, no operations team. Buzq is the ops room you cannot hire yet.",
    points: [
      "See failed checkouts the moment they happen — not in a weekly Stripe email.",
      "Invite the founder, the engineer, and the first support hire into the same workspace.",
      "Default channels for signups, payments, errors, and deploys so you do not have to invent a taxonomy.",
    ],
  },
  {
    slug: "developers",
    title: "For developers",
    lede: "If the code path already ran, the team should already know. One fetch in the catch block.",
    points: [
      "A tiny ingest API: channel, status, event, title, message, metadata.",
      "Works from Node, Python, Go, PHP, mobile — anywhere you can POST JSON.",
      "Reply in-thread when you are debugging. The stack stays in metadata; the conversation stays human.",
    ],
  },
  {
    slug: "leadership",
    title: "For CEOs and operators",
    lede: "You should not need Grafana to know if the business is working today.",
    points: [
      "Green and red cards in a Slack-like stream. No query language.",
      "Jump into a thread, ask “is this one user or everyone?”, move on.",
      "DMs for the quiet follow-ups. Channels for the company memory.",
    ],
  },
  {
    slug: "payments",
    title: "Payment monitoring",
    lede: "Declined cards, webhook misses, refunds, and successful charges — in #payments.",
    points: [
      "Fire success from the webhook that marks an order paid.",
      "Fire error from the branch that catches StripeCardError.",
      "Thread the incident with support without leaving the workspace.",
    ],
  },
  {
    slug: "authentication",
    title: "Authentication and signup health",
    lede: "New users, incomplete registrations, SSO failures, password resets that bounce.",
    points: [
      "Route user.signup, user.signup_incomplete, and user.signup_failed to #signups.",
      "Spot a broken OAuth client before App Store reviews do.",
      "Celebrate real signups in the same channel so the feed is not only bad news.",
    ],
  },
  {
    slug: "saas",
    title: "For SaaS products",
    lede: "Every product has a spine: auth, billing, core action. Instrument the spine.",
    points: [
      "One workspace per product, or one workspace with channels per service.",
      "Invite customer success into the channels that affect accounts.",
      "Keep #random for humans. Keep #errors for the night it all goes wrong.",
    ],
  },
];

export const COMPARE = [
  {
    slug: "sentry",
    title: "Buzq vs Sentry",
    lede: "Sentry is for stack traces. Buzq is for the moment a product path succeeded or failed — in language the whole company can read.",
    body: [
      "Use Sentry (or any APM) for exceptions, sourcemaps, and release health. Use Buzq when a business event should become a conversation.",
      "A declined card is not an exception you need grouped. It is a sentence in #payments. An incomplete signup is not a crash. It is a leak.",
      "They complement each other. Many teams keep Sentry for engineers and Buzq for everyone else.",
    ],
  },
  {
    slug: "slack",
    title: "Buzq vs Slack incoming webhooks",
    lede: "You could POST to Slack. You would still be stuffing product telemetry into a chat tool that was not built for events.",
    body: [
      "Slack webhooks dump text into a channel. Buzq events are first-class: status color, metadata, thread, and a workspace that is about your product — not about everything else at the company.",
      "Invites, DMs, and log channels live in one place. You do not fight Slack’s notification settings to make sure the CEO sees a failed charge.",
      "The UI is deliberately Slack-like so the muscle memory transfers. The data model is events, not status updates about lunch.",
    ],
  },
  {
    slug: "pagerduty",
    title: "Buzq vs PagerDuty",
    lede: "PagerDuty wakes people up. Buzq keeps people informed. Most product failures should not page. They should be discussed.",
    body: [
      "Page on SEV-1. Chat on everything else. If every declined card is an incident, nobody will answer the phone.",
      "Buzq sits in the middle: realtime, threaded, invitible, and calm enough to leave open all day.",
    ],
  },
];

export const FEATURES = [
  {
    title: "Instrument success and failure",
    body: "One POST in the try, one POST in the catch. Status is success, error, warning, or info.",
  },
  {
    title: "Slack-like channels",
    body: "Default streams for signups, payments, errors, deploys, plus any channel you create.",
  },
  {
    title: "Threads on every event",
    body: "Reply under a failed payment the same way you reply under a Slack message.",
  },
  {
    title: "Workspace and channel invites",
    body: "Bring the CEO, support, and contractors in. Private channels stay invite-only.",
  },
  {
    title: "DMs",
    body: "Side conversations without leaving the product pulse.",
  },
  {
    title: "Emoji reactions",
    body: "Hover a message, tap 👍 👀 ✅, or open the picker. React in channels, threads, and DMs.",
  },
  {
    title: "Realtime on Firebase",
    body: "New events appear as they are written. No polling. No refresh.",
  },
];
