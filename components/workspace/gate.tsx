"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getWorkspaceBySlug } from "@/lib/db";
import { WorkspaceProvider } from "@/lib/workspace-context";

export function WorkspaceGate({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!params.slug) return;
    let cancelled = false;
    getWorkspaceBySlug(params.slug).then((ws) => {
      if (cancelled) return;
      if (!ws) setMissing(true);
      else setWorkspaceId(ws.id);
    });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (missing) {
    return (
      <div className="grid h-screen place-items-center" style={{ background: "var(--mkt-bg)" }}>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold">Workspace not found</h1>
          <p className="mt-2 text-[var(--mkt-muted)]">Check the URL or create a new workspace.</p>
          <a href="/onboarding" className="mt-4 inline-block text-[#d7263d] font-bold">
            Create workspace
          </a>
        </div>
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <div className="grid h-screen place-items-center text-white" style={{ background: "var(--sidebar)" }}>
        Opening workspace…
      </div>
    );
  }

  return <WorkspaceProvider workspaceId={workspaceId}>{children}</WorkspaceProvider>;
}
