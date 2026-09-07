import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Trust", "Hashed API keys, Firebase rules, and Cloudinary uploads.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Why Buzq" title="Trust" lede="Keys are hashed. Rules scope data to members. Uploads can be signed." paragraphs={["The ingest path uses Firebase Admin so your product never needs a user session.", "Rotate keys in workspace settings. Prefer identifiers over raw PII in metadata."]} />
  );
}
