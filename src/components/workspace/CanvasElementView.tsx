import { memo } from 'react'
import type { CanvasElement } from '../../types'
import type { ResizeHandle } from '../../utils/canvas'
import { RESIZE_HANDLES } from '../../utils/canvas'
import { getMiddleTextStyle, getResolvedVerticalAlign, getTextTypography } from '../../utils/textLayout'

interface CanvasElementViewProps {
  element: CanvasElement
  isSelected: boolean
  onSelect: (id: string) => void
  onDragStart: (e: React.MouseEvent, element: CanvasElement) => void
  onResizeStart: (e: React.MouseEvent, element: CanvasElement, handle: ResizeHandle) => void
  interactive?: boolean
  forExport?: boolean
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

function renderTextContent(element: CanvasElement, forExport: boolean) {
  const verticalAlign = getResolvedVerticalAlign(element)
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: forExport ? 'visible' : 'hidden',
  }

  if (verticalAlign === 'middle') {
    return (
      <div data-text-valign="middle" style={wrapperStyle}>
        <div style={getMiddleTextStyle(element, forExport)}>{element.content}</div>
      </div>
    )
  }

  return (
    <div style={wrapperStyle}>
      <div style={getTextTypography(element, forExport)}>{element.content}</div>
    </div>
  )
}

export const CanvasElementView = memo(function CanvasElementView({
  element,
  isSelected,
  onSelect,
  onDragStart,
  onResizeStart,
  interactive = true,
  forExport = false,
}: CanvasElementViewProps) {
  const isText = element.type === 'text'

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.style?.opacity ?? 1,
    cursor: !interactive || element.locked ? 'default' : 'move',
    zIndex: isSelected ? 20 : element.type === 'text' ? 2 : element.locked && element.type === 'shape' ? 0 : 1,
    pointerEvents: interactive && element.locked && element.type === 'shape' ? 'none' : undefined,
    overflow: forExport && isText ? 'visible' : undefined,
  }

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return renderTextContent(element, forExport)
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
              pointerEvents: 'none',
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
      className={forExport ? 'canvas-element' : `canvas-element ${isSelected ? 'selected' : ''}`}
      style={style}
      onMouseDown={
        interactive
          ? (e) => {
              e.stopPropagation()
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
