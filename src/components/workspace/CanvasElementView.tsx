import { memo } from 'react'
import type { CanvasElement } from '../../types'
import type { ResizeHandle } from '../../utils/canvas'
import { RESIZE_HANDLES } from '../../utils/canvas'

interface CanvasElementViewProps {
  element: CanvasElement
  isSelected: boolean
  onSelect: (id: string) => void
  onDragStart: (e: React.MouseEvent, element: CanvasElement) => void
  onResizeStart: (e: React.MouseEvent, element: CanvasElement, handle: ResizeHandle) => void
  interactive?: boolean
}

function getHandleStyle(handle: ResizeHandle, w: number, h: number): React.CSSProperties {
  const positions: Record<ResizeHandle, React.CSSProperties> = {
    nw: { top: -4, left: -4, cursor: 'nwse-resize' },
    n: { top: -4, left: w / 2 - 4, cursor: 'ns-resize' },
    ne: { top: -4, right: -4, cursor: 'nesw-resize' },
    e: { top: h / 2 - 4, right: -4, cursor: 'ew-resize' },
    se: { bottom: -4, right: -4, cursor: 'nwse-resize' },
    s: { bottom: -4, left: w / 2 - 4, cursor: 'ns-resize' },
    sw: { bottom: -4, left: -4, cursor: 'nesw-resize' },
    w: { top: h / 2 - 4, left: -4, cursor: 'ew-resize' },
  }
  return positions[handle]
}

export const CanvasElementView = memo(function CanvasElementView({
  element,
  isSelected,
  onSelect,
  onDragStart,
  onResizeStart,
  interactive = true,
}: CanvasElementViewProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.style?.opacity ?? 1,
    cursor: !interactive || element.locked ? 'default' : 'move',
    zIndex: isSelected ? 20 : 1,
  }

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              fontSize: element.style?.fontSize ?? 16,
              fontWeight: element.style?.fontWeight ?? 400,
              color: element.style?.color ?? '#000',
              textAlign: element.style?.textAlign ?? 'left',
              lineHeight: element.style?.lineHeight ?? 1.4,
              letterSpacing: element.style?.letterSpacing,
              fontFamily: element.style?.fontFamily ?? 'Inter, sans-serif',
              display: 'flex',
              alignItems: element.style?.textAlign === 'center' ? 'center' : 'flex-start',
              justifyContent:
                element.style?.textAlign === 'center'
                  ? 'center'
                  : element.style?.textAlign === 'right'
                    ? 'flex-end'
                    : 'flex-start',
              overflow: 'hidden',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {element.content}
          </div>
        )
      case 'image':
      case 'qrcode':
        return (
          <img
            src={element.src ?? element.content}
            alt=""
            crossOrigin="anonymous"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: element.style?.objectFit ?? 'cover',
              borderRadius: element.style?.borderRadius ?? 0,
              backgroundColor: element.style?.backgroundColor,
            }}
          />
        )
      case 'shape':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: element.style?.backgroundColor ?? 'transparent',
              borderRadius: element.style?.borderRadius ?? 0,
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={style}
      onMouseDown={
        interactive
          ? (e) => {
              onSelect(element.id)
              if (!element.locked) onDragStart(e, element)
            }
          : undefined
      }
    >
      {renderContent()}
      {interactive && isSelected && !element.locked && (
        <>
          {RESIZE_HANDLES.map((handle) => (
            <div
              key={handle}
              className="resize-handle"
              style={getHandleStyle(handle, element.width, element.height)}
              onMouseDown={(e) => onResizeStart(e, element, handle)}
            />
          ))}
        </>
      )}
    </div>
  )
})
