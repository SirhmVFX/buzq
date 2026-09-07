import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "SDK snippets",
  description: "Node, Python, and cURL examples for Buzq success and fail blocks.",
};

export default function SdksPage() {
  return (
    <MarketingShell>
      <PageHero kicker="Docs" title="Snippets" lede="There is no required SDK. fetch, requests, or curl is enough." />
      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-24">
        <pre className="overflow-x-auto rounded-2xl p-5 font-mono text-[12.5px] leading-6" style={{ background: "#1a1214", color: "#f6ecee" }}>{`# Node
await fetch(process.env.BUZQ_URL, {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BUZQ_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    channel: "signups",
    status: "success",
    event: "user.signup",
    title: "New user signed up",
    message: email,
  }),
})

# Python
requests.post(os.environ["BUZQ_URL"], json={...},
  headers={"Authorization": f"Bearer {os.environ['BUZQ_KEY']}"})

# cURL
curl -X POST "$BUZQ_URL" \\
  -H "Authorization: Bearer $BUZQ_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"channel":"errors","status":"error","event":"job.failed","title":"Worker died","message":"timeout"}'`}</pre>
      </div>
    </MarketingShell>
  );
}
