import { Download, ZoomIn, ZoomOut, RotateCcw, Loader2, Package } from 'lucide-react'
import { Button } from '../ui/Button'
import { useCanvasExport } from '../../hooks/useCanvasExport'
import { useTranslation } from '../../hooks/useTranslation'
import type { GeneratedAsset } from '../../types'

interface ToolbarProps {
  assetName: string
  activeAsset: GeneratedAsset | null
  allAssets: GeneratedAsset[]
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

export function Toolbar({
  assetName,
  activeAsset,
  allAssets,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ToolbarProps) {
  const { t, assetLabel } = useTranslation()
  const { exportPng, exportAll, isExporting } = useCanvasExport()

  const handleExport = () => {
    if (activeAsset) exportPng(activeAsset, assetName)
  }

  const handleExportAll = () => {
    exportAll(allAssets, (asset) => assetLabel(asset.assetType))
  }

  return (
    <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-slate-200 bg-white gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-slate-900 truncate">{assetName}</span>
        <span className="text-xs text-slate-400 shrink-0">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onZoomOut} title={t('workspace.zoomOut')}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onResetZoom} title={t('workspace.resetZoom')} className="hidden sm:inline-flex">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onZoomIn} title={t('workspace.zoomIn')}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />
        <Button size="sm" onClick={handleExport} disabled={isExporting || !activeAsset}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden sm:inline">{t('workspace.exportPng')}</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExportAll} disabled={isExporting || allAssets.length === 0}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
          <span className="hidden md:inline">{t('workspace.exportAll')}</span>
        </Button>
      </div>
    </div>
  )
}
