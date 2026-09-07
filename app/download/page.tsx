import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Download snippet", "Copy the success/fail fetch snippet for Buzq ingest.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Developers" title="Download the snippet" lede="There is no binary to install. Copy the POST from Docs → SDKs and put it in both code paths." paragraphs={["Workspace settings also prints a ready-to-paste fetch with your live key prefix.", "CORS is open on /api/v1/events so any backend can call it."]} />
  );
}
