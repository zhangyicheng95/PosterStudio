import { useCallback, useState } from 'react'
import { exportCanvasToPng, exportMultipleCanvases, sanitizeFilename } from '../utils/export'
import type { AssetType } from '../types'

export function useCanvasExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportPng = useCallback(async (element: HTMLElement | null, name: string) => {
    if (!element || isExporting) return
    setIsExporting(true)
    try {
      await exportCanvasToPng(element, `${sanitizeFilename(name)}.png`, 2)
    } finally {
      setIsExporting(false)
    }
  }, [isExporting])

  const exportAll = useCallback(async (assetTypes: AssetType[], getLabel: (type: AssetType) => string) => {
    if (isExporting) return
    setIsExporting(true)
    try {
      const items = assetTypes
        .map((type) => {
          const element = document.querySelector(`[data-export-canvas="${type}"]`) as HTMLElement | null
          if (!element) return null
          return { element, filename: `${sanitizeFilename(getLabel(type))}.png` }
        })
        .filter(Boolean) as { element: HTMLElement; filename: string }[]

      await exportMultipleCanvases(items)
    } finally {
      setIsExporting(false)
    }
  }, [isExporting])

  return { exportPng, exportAll, isExporting }
}
