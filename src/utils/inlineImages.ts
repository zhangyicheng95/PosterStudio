import type { GeneratedAsset, CanvasElement } from '../types'

const cache = new Map<string, string>()

export async function urlToDataUrl(url: string): Promise<string> {
  if (!url) return url
  if (url.startsWith('data:')) return url

  const cached = cache.get(url)
  if (cached) return cached

  try {
    if (url.startsWith('blob:')) {
      const res = await fetch(url)
      const blob = await res.blob()
      const dataUrl = await blobToDataUrl(blob)
      cache.set(url, dataUrl)
      return dataUrl
    }

    const pngUrl = url.includes('api.dicebear.com') && url.includes('/svg?')
      ? url.replace('/svg?', '/png?')
      : url

    const res = await fetch(pngUrl, { mode: 'cors' })
    if (res.ok) {
      const blob = await res.blob()
      const dataUrl = await blobToDataUrl(blob)
      cache.set(url, dataUrl)
      return dataUrl
    }
  } catch {
    // fall through to canvas approach
  }

  const dataUrl = await loadViaCanvas(url.includes('/svg?') ? url.replace('/svg?', '/png?') : url)
  cache.set(url, dataUrl)
  return dataUrl
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function loadViaCanvas(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || 128
        canvas.height = img.naturalHeight || 128
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(url)
          return
        }
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch {
        resolve(url)
      }
    }
    img.onerror = () => resolve(url)
    img.src = url
  })
}

async function inlineElementImages(element: CanvasElement): Promise<CanvasElement> {
  if (element.type !== 'image' && element.type !== 'qrcode') return element
  const src = element.src ?? element.content
  if (!src) return element
  const dataUrl = await urlToDataUrl(src)
  return { ...element, src: dataUrl }
}

export async function inlineAssetImages(asset: GeneratedAsset): Promise<GeneratedAsset> {
  const elements = await Promise.all(asset.elements.map(inlineElementImages))
  return { ...asset, elements }
}

export async function applyInlineImages(container: HTMLElement): Promise<void> {
  const imgs = Array.from(container.querySelectorAll('img'))
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src')
      if (!src || src.startsWith('data:')) return
      try {
        img.src = await urlToDataUrl(src)
      } catch {
        // keep original
      }
    }),
  )

  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve()
            return
          }
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }),
    ),
  )
}
