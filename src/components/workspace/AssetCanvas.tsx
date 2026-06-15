import type { GeneratedAsset } from '../../types'
import { normalizeOverlayElements } from '../../utils/canvas'
import { CanvasElementView } from './CanvasElementView'

interface AssetCanvasProps {
  asset: GeneratedAsset
  exportId?: string
  showShadow?: boolean
  forExport?: boolean
  children?: React.ReactNode
}

export function AssetCanvas({
  asset,
  exportId,
  showShadow = false,
  forExport = false,
  children,
}: AssetCanvasProps) {
  const elements = normalizeOverlayElements(asset.elements)

  return (
    <div
      data-export-canvas={exportId ?? 'active'}
      style={{
        width: asset.width,
        height: asset.height,
        background: asset.background,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: showShadow && !forExport
          ? '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)'
          : undefined,
        borderRadius: showShadow && !forExport ? 4 : 0,
      }}
    >
      {children ??
        elements.map((element) => (
          <CanvasElementView
            key={element.id}
            element={element}
            isSelected={false}
            onSelect={() => {}}
            onDragStart={() => {}}
            onResizeStart={() => {}}
            interactive={false}
            forExport={forExport}
          />
        ))}
    </div>
  )
}
