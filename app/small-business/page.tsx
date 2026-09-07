import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Small business", "Buzq for small teams that cannot hire an ops function yet.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Solutions" title="Small business" lede="Five people, one product, no NOC. The stream is the ops room." paragraphs={["Default channels cover signups, payments, errors, and deploys. Invite whoever answers the phone.", "Free is enough until history and invites matter. Upgrade when the CEO lives in #payments."]} />
  );
}
