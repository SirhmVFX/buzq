"use client";

import { useParams } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace/shell";

export default function WorkspaceHome() {
  const params = useParams<{ slug: string }>();
  return <WorkspaceShell slug={params.slug} />;
}
