import type { CSSProperties } from 'react'
import type { CanvasElement, ElementStyle } from '../types'

export function lineBoxHeight(style: ElementStyle): number {
  const fontSize = Number(style.fontSize ?? 16)
  const lineHeight = Number(style.lineHeight ?? 1.2)
  return Math.ceil(fontSize * lineHeight)
}

export function estimateLineCount(element: CanvasElement): number {
  const content = element.content ?? ''
  if (!content) return 1
  if (content.includes('\n')) return content.split('\n').length

  const fontSize = Number(element.style?.fontSize ?? 16)
  const fontWeight = Number(element.style?.fontWeight ?? 400)
  const isBold = fontWeight >= 600
  const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(content)
  const avgCharWidth = fontSize * (hasCJK ? (isBold ? 1.05 : 1) : isBold ? 0.62 : 0.55)
  const charsPerLine = Math.max(1, Math.floor(element.width / avgCharWidth))
  return Math.max(1, Math.ceil(content.length / charsPerLine))
}

export function getResolvedVerticalAlign(element: CanvasElement): 'top' | 'middle' {
  if (element.style?.verticalAlign) return element.style.verticalAlign
  if (element.style?.textAlign === 'center') return 'middle'
  return 'top'
}

/** Pixel padding to vertically center text (html2canvas-safe; no transform/flex). */
export function getVerticalCenterPadding(element: CanvasElement): number {
  const fontSize = Number(element.style?.fontSize ?? 16)
  const lineHeightRatio = Number(element.style?.lineHeight ?? 1.2)
  const content = element.content ?? ''
  const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(content)
  const lineCount = estimateLineCount(element)

  let lineHeightPx: number
  if (hasCJK && lineCount === 1) {
    // html2canvas renders CJK glyphs shorter than CSS line-height suggests
    lineHeightPx = fontSize * 0.9
  } else if (hasCJK) {
    lineHeightPx = fontSize * Math.min(lineHeightRatio, 1.1)
  } else {
    lineHeightPx = fontSize * lineHeightRatio
  }

  const textBlockHeight = lineHeightPx * lineCount
  return Math.max(0, Math.round((element.height - textBlockHeight) / 2))
}

export function getTextTypography(element: CanvasElement, forExport: boolean): CSSProperties {
  const lineHeightRatio = Number(element.style?.lineHeight ?? 1.2)

  return {
    width: '100%',
    margin: 0,
    padding: 0,
    fontSize: Number(element.style?.fontSize ?? 16),
    fontWeight: element.style?.fontWeight ?? 400,
    color: element.style?.color ?? '#000',
    textAlign: element.style?.textAlign ?? 'left',
    lineHeight: lineHeightRatio,
    letterSpacing: element.style?.letterSpacing,
    fontFamily: element.style?.fontFamily ?? 'Inter, sans-serif',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    boxSizing: 'border-box',
    overflow: forExport ? 'visible' : 'hidden',
  }
}

export function getMiddleTextStyle(element: CanvasElement, forExport: boolean): CSSProperties {
  const paddingTop = getVerticalCenterPadding(element)
  return {
    ...getTextTypography(element, forExport),
    display: 'block',
    paddingTop,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }
}
