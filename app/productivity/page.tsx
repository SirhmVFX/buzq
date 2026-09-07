import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Productivity", "Stop visiting dashboards. Let the event interrupt you like Slack does.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Why Buzq" title="Productivity" lede="Chat interrupts. Dashboards wait to be opened." paragraphs={["A status, a title, and a thread is enough observability for most product questions.", "React when it is handled. Reply when it is not. DM when it is sensitive."]} />
  );
}
