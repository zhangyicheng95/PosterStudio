import { Navigate } from 'react-router-dom'
import { useWorkspaceStore } from '../store/workspaceStore'

export function RequireGenerated({ children }: { children: React.ReactNode }) {
  const hasGenerated = useWorkspaceStore((s) => s.hasGenerated)
  if (!hasGenerated) return <Navigate to="/upload" replace />
  return children
}
