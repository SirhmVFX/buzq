import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Accessibility", "Buzq aims for Slack-like keyboard and contrast habits.");

export default function Page() {
  return (
    <SimpleSeoPage
      kicker="Trust"
      title="Accessibility"
      lede="Keyboard jump-to, visible focus, and contrast that survives dark mode."
      paragraphs={[
        "The workspace uses a high-contrast sidebar, visible hover states, and Enter-to-send with Shift+Enter for a new line — the same habits Slack trained.",
        "Marketing search is ⌘K. Escape closes menus. We keep body copy off the brand red except for links and errors.",
        "If something is hard to use, tell us via Contact. We treat that as a product bug.",
      ]}
    />
  );
}
