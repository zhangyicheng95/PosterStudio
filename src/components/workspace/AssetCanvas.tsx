import type { GeneratedAsset } from '../../types'
import { CanvasElementView } from './CanvasElementView'

interface AssetCanvasProps {
  asset: GeneratedAsset
  exportId?: string
  showShadow?: boolean
  children?: React.ReactNode
}

export function AssetCanvas({ asset, exportId, showShadow = false, children }: AssetCanvasProps) {
  return (
    <div
      data-export-canvas={exportId ?? 'active'}
      style={{
        width: asset.width,
        height: asset.height,
        background: asset.background,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: showShadow
          ? '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)'
          : undefined,
        borderRadius: showShadow ? 4 : 0,
      }}
    >
      {children ??
        asset.elements.map((element) => (
          <CanvasElementView
            key={element.id}
            element={element}
            isSelected={false}
            onSelect={() => {}}
            onDragStart={() => {}}
            onResizeStart={() => {}}
            interactive={false}
          />
        ))}
    </div>
  )
}

interface HiddenExportCanvasesProps {
  assets: GeneratedAsset[]
}

export function HiddenExportCanvases({ assets }: HiddenExportCanvasesProps) {
  return (
    <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none" aria-hidden>
      {assets.map((asset) => (
        <AssetCanvas key={asset.assetType} asset={asset} exportId={asset.assetType} />
      ))}
    </div>
  )
}
