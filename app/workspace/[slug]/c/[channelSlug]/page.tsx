"use client";

import { useParams } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace/shell";

export default function ChannelPage() {
  const params = useParams<{ slug: string; channelSlug: string }>();
  return <WorkspaceShell slug={params.slug} channelSlug={params.channelSlug} />;
}
