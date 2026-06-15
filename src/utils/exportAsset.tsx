import { createRoot, type Root } from 'react-dom/client'
import { AssetCanvas } from '../components/workspace/AssetCanvas'
import type { GeneratedAsset } from '../types'
import { exportCanvasToPng, sanitizeFilename } from './export'
import { inlineAssetImages, applyInlineImages } from './inlineImages'

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

async function renderAndCapture(asset: GeneratedAsset, filename: string): Promise<void> {
  const inlinedAsset = await inlineAssetImages(asset)

  const host = document.createElement('div')
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    `width:${asset.width}px`,
    `height:${asset.height}px`,
    'overflow:hidden',
    'z-index:-9999',
    'pointer-events:none',
    'opacity:1',
  ].join(';')
  document.body.appendChild(host)

  let root: Root | null = null
  try {
    root = createRoot(host)
    root.render(<AssetCanvas asset={inlinedAsset} forExport />)

    await waitForPaint()
    await applyInlineImages(host)
    await waitForPaint()

    const canvasEl = host.querySelector('[data-export-canvas]') as HTMLElement | null
    if (!canvasEl) throw new Error('Export canvas element not found')

    await exportCanvasToPng(canvasEl, filename, 2, asset.width, asset.height)
  } finally {
    root?.unmount()
    host.remove()
  }
}

export async function exportAssetToPng(asset: GeneratedAsset, displayName?: string): Promise<void> {
  const filename = `${sanitizeFilename(displayName ?? asset.name ?? asset.assetType)}.png`
  await renderAndCapture(asset, filename)
}

export async function exportAllAssetsToPng(
  assets: GeneratedAsset[],
  getLabel?: (asset: GeneratedAsset) => string,
): Promise<void> {
  for (const asset of assets) {
    const name = getLabel?.(asset) ?? asset.name
    await exportAssetToPng(asset, name)
    await new Promise((r) => setTimeout(r, 300))
  }
}
