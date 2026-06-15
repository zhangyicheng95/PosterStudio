import { useRef } from 'react'
import type { GeneratedAsset } from '../../types'
import { useDragResize } from '../../hooks/useDragResize'
import { useTranslation } from '../../hooks/useTranslation'
import { CanvasElementView } from './CanvasElementView'

interface CanvasEditorProps {
  asset: GeneratedAsset | null
  zoom: number
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<import('../../types').CanvasElement>) => void
  canvasRef?: React.RefObject<HTMLDivElement | null>
}

export function CanvasEditor({
  asset,
  zoom,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  canvasRef: externalRef,
}: CanvasEditorProps) {
  const { t } = useTranslation()
  const internalRef = useRef<HTMLDivElement>(null)
  const canvasRef = externalRef ?? internalRef

  const { startDrag, startResize } = useDragResize({
    zoom,
    onUpdate: onUpdateElement,
    canvasRef,
  })

  if (!asset) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-100/50">
        <div className="text-center text-slate-400">
          <p className="text-sm">{t('workspace.noAsset')}</p>
          <p className="text-xs mt-1">{t('workspace.noAssetHint')}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-1 items-center justify-center overflow-auto bg-[#e8eaed] p-8"
      onClick={() => onSelectElement(null)}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease',
        }}
      >
        <div
          ref={canvasRef}
          id="export-canvas"
          data-export-canvas
          style={{
            width: asset.width,
            height: asset.height,
            background: asset.background,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            borderRadius: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {asset.elements.map((element) => (
            <CanvasElementView
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={onSelectElement}
              onDragStart={startDrag}
              onResizeStart={startResize}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
