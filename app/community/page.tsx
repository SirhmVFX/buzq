import type { Metadata } from "next";
import { SimpleSeoPage, seo } from "@/components/marketing/simple-page";

export const metadata: Metadata = seo("Community", "Founders and engineers comparing notes on product pulse.");
export default function Page() {
  return (
    <SimpleSeoPage kicker="Resources" title="Community" lede="The blog and customers pages are the public square for now." paragraphs={["If you instrumented a nasty payment leak, write it up — we will feature it.", "Events and partner programs come after the stream is boringly reliable."]} />
  );
}
