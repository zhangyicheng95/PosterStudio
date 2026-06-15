import { Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { useCanvasExport } from '../../hooks/useCanvasExport'
import { useTranslation } from '../../hooks/useTranslation'

interface ToolbarProps {
  assetName: string
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

export function Toolbar({ assetName, zoom, onZoomIn, onZoomOut, onResetZoom }: ToolbarProps) {
  const { t } = useTranslation()
  const { exportPng } = useCanvasExport()

  const handleExport = () => {
    const canvas = document.querySelector('[data-export-canvas]') as HTMLElement
    exportPng(canvas, assetName)
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-900">{assetName}</span>
        <span className="text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onZoomOut} title={t('workspace.zoomOut')}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onResetZoom} title={t('workspace.resetZoom')}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onZoomIn} title={t('workspace.zoomIn')}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <Button size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" />
          {t('workspace.exportPng')}
        </Button>
      </div>
    </div>
  )
}
