import { useEffect } from 'react'
import { useWorkspaceStore } from '../store/workspaceStore'

function isInputFocused() {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable
}

interface UseWorkspaceShortcutsOptions {
  onExport: () => void
  onExportAll: () => void
}

export function useWorkspaceShortcuts({ onExport, onExportAll }: UseWorkspaceShortcutsOptions) {
  const setSelectedElement = useWorkspaceStore((s) => s.setSelectedElement)
  const setZoom = useWorkspaceStore((s) => s.setZoom)
  const zoom = useWorkspaceStore((s) => s.zoom)
  const selectedElementId = useWorkspaceStore((s) => s.selectedElementId)
  const updateElement = useWorkspaceStore((s) => s.updateElement)
  const getActiveAsset = useWorkspaceStore((s) => s.getActiveAsset)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return

      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === 's') {
        e.preventDefault()
        if (e.shiftKey) onExportAll()
        else onExport()
        return
      }

      if (e.key === 'Escape') {
        setSelectedElement(null)
        return
      }

      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        setZoom(zoom + 0.05)
        return
      }

      if (e.key === '-') {
        e.preventDefault()
        setZoom(zoom - 0.05)
        return
      }

      if (e.key === '0') {
        e.preventDefault()
        setZoom(0.45)
        return
      }

      if (!selectedElementId) return
      const asset = getActiveAsset()
      const element = asset?.elements.find((el) => el.id === selectedElementId)
      if (!element || element.locked) return

      const step = e.shiftKey ? 10 : 1
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const delta = { x: 0, y: 0 }
        if (e.key === 'ArrowUp') delta.y = -step
        if (e.key === 'ArrowDown') delta.y = step
        if (e.key === 'ArrowLeft') delta.x = -step
        if (e.key === 'ArrowRight') delta.x = step
        updateElement(selectedElementId, { x: element.x + delta.x, y: element.y + delta.y })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [zoom, selectedElementId, setSelectedElement, setZoom, updateElement, getActiveAsset, onExport, onExportAll])
}
