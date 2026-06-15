import type { CanvasElement } from '../types'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function cloneElements(elements: CanvasElement[]): CanvasElement[] {
  return elements.map((el) => ({ ...el, style: el.style ? { ...el.style } : undefined }))
}

export function updateElementById(
  elements: CanvasElement[],
  id: string,
  updates: Partial<CanvasElement>,
): CanvasElement[] {
  return elements.map((el) => (el.id === id ? { ...el, ...updates, style: { ...el.style, ...updates.style } } : el))
}

export function getElementBounds(element: CanvasElement) {
  return {
    left: element.x,
    top: element.y,
    right: element.x + element.width,
    bottom: element.y + element.height,
  }
}

export function scaleElements(
  elements: CanvasElement[],
  fromWidth: number,
  fromHeight: number,
  toWidth: number,
  toHeight: number,
): CanvasElement[] {
  const scaleX = toWidth / fromWidth
  const scaleY = toHeight / fromHeight
  return elements.map((el) => ({
    ...el,
    x: el.x * scaleX,
    y: el.y * scaleY,
    width: el.width * scaleX,
    height: el.height * scaleY,
    style: el.style?.fontSize ? { ...el.style, fontSize: (el.style.fontSize ?? 16) * Math.min(scaleX, scaleY) } : el.style,
  }))
}

export const MIN_ELEMENT_SIZE = 20

export const RESIZE_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const
export type ResizeHandle = (typeof RESIZE_HANDLES)[number]
