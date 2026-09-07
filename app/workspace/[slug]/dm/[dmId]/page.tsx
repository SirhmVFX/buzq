"use client";

import { useParams } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace/shell";

export default function DmPage() {
  const params = useParams<{ slug: string; dmId: string }>();
  return <WorkspaceShell slug={params.slug} dmId={params.dmId} />;
}
