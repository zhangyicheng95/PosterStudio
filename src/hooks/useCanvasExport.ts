import { useCallback, useState } from 'react'
import type { GeneratedAsset } from '../types'
import { exportAssetToPng, exportAllAssetsToPng } from '../utils/exportAsset'

export function useCanvasExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportPng = useCallback(async (asset: GeneratedAsset | null, name: string) => {
    if (!asset || isExporting) return
    setIsExporting(true)
    try {
      await exportAssetToPng(asset, name)
    } finally {
      setIsExporting(false)
    }
  }, [isExporting])

  const exportAll = useCallback(async (
    assets: GeneratedAsset[],
    getLabel: (asset: GeneratedAsset) => string,
  ) => {
    if (isExporting || assets.length === 0) return
    setIsExporting(true)
    try {
      await exportAllAssetsToPng(assets, getLabel)
    } finally {
      setIsExporting(false)
    }
  }, [isExporting])

  return { exportPng, exportAll, isExporting }
}
