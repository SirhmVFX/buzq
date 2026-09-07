import { WorkspaceGate } from "@/components/workspace/gate";

export default function WorkspaceLayout({ children }: LayoutProps<"/workspace/[slug]">) {
  return <WorkspaceGate>{children}</WorkspaceGate>;
}
