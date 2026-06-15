import { useCallback, useRef } from 'react'
import { exportCanvasToPng, sanitizeFilename } from '../utils/export'

export function useCanvasExport() {
  const exporting = useRef(false)

  const exportPng = useCallback(async (element: HTMLElement | null, name: string) => {
    if (!element || exporting.current) return
    exporting.current = true
    try {
      await exportCanvasToPng(element, `${sanitizeFilename(name)}.png`, 2)
    } finally {
      exporting.current = false
    }
  }, [])

  return { exportPng }
}
