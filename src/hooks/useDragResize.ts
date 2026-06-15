import { useCallback, useEffect, useState } from 'react'
import type { CanvasElement } from '../types'
import { clamp, MIN_ELEMENT_SIZE } from '../utils/canvas'
import type { ResizeHandle } from '../utils/canvas'

interface DragState {
  elementId: string
  startX: number
  startY: number
  origX: number
  origY: number
}

interface ResizeState {
  elementId: string
  handle: ResizeHandle
  startX: number
  startY: number
  origX: number
  origY: number
  origW: number
  origH: number
}

interface UseDragResizeOptions {
  zoom: number
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void
  canvasRef: React.RefObject<HTMLDivElement | null>
}

export function useDragResize({ zoom, onUpdate, canvasRef }: UseDragResizeOptions) {
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

  const startDrag = useCallback(
    (e: React.MouseEvent, element: CanvasElement) => {
      if (element.locked) return
      e.stopPropagation()
      e.preventDefault()
      setDragState({
        elementId: element.id,
        startX: e.clientX,
        startY: e.clientY,
        origX: element.x,
        origY: element.y,
      })
    },
    [],
  )

  const startResize = useCallback(
    (e: React.MouseEvent, element: CanvasElement, handle: ResizeHandle) => {
      if (element.locked) return
      e.stopPropagation()
      e.preventDefault()
      setResizeState({
        elementId: element.id,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        origX: element.x,
        origY: element.y,
        origW: element.width,
        origH: element.height,
      })
    },
    [],
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragState) {
        const dx = (e.clientX - dragState.startX) / zoom
        const dy = (e.clientY - dragState.startY) / zoom
        onUpdate(dragState.elementId, {
          x: dragState.origX + dx,
          y: dragState.origY + dy,
        })
      }
      if (resizeState) {
        const dx = (e.clientX - resizeState.startX) / zoom
        const dy = (e.clientY - resizeState.startY) / zoom
        let { origX: x, origY: y, origW: w, origH: h } = resizeState
        const handle = resizeState.handle

        if (handle.includes('e')) w = clamp(resizeState.origW + dx, MIN_ELEMENT_SIZE, 2000)
        if (handle.includes('s')) h = clamp(resizeState.origH + dy, MIN_ELEMENT_SIZE, 2000)
        if (handle.includes('w')) {
          w = clamp(resizeState.origW - dx, MIN_ELEMENT_SIZE, 2000)
          x = resizeState.origX + (resizeState.origW - w)
        }
        if (handle.includes('n')) {
          h = clamp(resizeState.origH - dy, MIN_ELEMENT_SIZE, 2000)
          y = resizeState.origY + (resizeState.origH - h)
        }

        onUpdate(resizeState.elementId, { x, y, width: w, height: h })
      }
    }

    const onUp = () => {
      setDragState(null)
      setResizeState(null)
    }

    if (dragState || resizeState) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragState, resizeState, zoom, onUpdate])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        return null
      }
      return undefined
    },
    [canvasRef],
  )

  return { startDrag, startResize, isDragging: !!dragState, isResizing: !!resizeState, handleCanvasClick }
}
