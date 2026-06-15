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

/** Snap label text onto its background shape (fixes legacy misaligned CTA/badge coords). */
const TEXT_OVERLAY_PAIRS: [string, string][] = [
  ['cta', 'cta-box'],
  ['cta-text', 'cta-badge'],
  ['badge', 'badge-bg'],
]

function snapTextToShape(text: CanvasElement, shape: CanvasElement): CanvasElement {
  return {
    ...text,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    style: {
      ...text.style,
      textAlign: text.style?.textAlign ?? 'center',
      verticalAlign: text.style?.verticalAlign ?? 'middle',
      lineHeight: text.style?.lineHeight ?? 1.2,
    },
  }
}

export function normalizeOverlayElements(elements: CanvasElement[]): CanvasElement[] {
  const list: CanvasElement[] = elements.map((e) => ({
    ...e,
    style: e.style ? { ...e.style } : undefined,
  }))
  const byId = new Map(list.map((e) => [e.id, e]))
  const shapes = list.filter((e) => e.type === 'shape')

  const snappedIds = new Set<string>()

  for (const [textId, shapeId] of TEXT_OVERLAY_PAIRS) {
    const text = byId.get(textId)
    const shape = byId.get(shapeId)
    if (!text || !shape || text.type !== 'text' || shape.type !== 'shape') continue
    byId.set(textId, snapTextToShape(text, shape))
    snappedIds.add(textId)
  }

  // Any CTA text → matching button background (covers renamed / legacy ids)
  for (const text of list) {
    if (text.type !== 'text' || text.fieldKey !== 'cta' || snappedIds.has(text.id)) continue
    const current = byId.get(text.id)!

    const shape =
      shapes.find((s) => s.id === `${text.id}-box`) ??
      shapes.find((s) => s.id === 'cta-box' || s.id === 'cta-badge')
    if (shape) byId.set(text.id, snapTextToShape(current, shape))
  }

  return list.map((e) => byId.get(e.id) ?? e)
}

