export async function exportCanvasToPng(
  element: HTMLElement,
  filename: string,
  scale = 2,
  width?: number,
  height?: number,
): Promise<void> {
  const { default: html2canvas } = await import('html2canvas')

  const options = {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    width: width ?? element.offsetWidth,
    height: height ?? element.offsetHeight,
    onclone: (_doc: Document, cloned: Element) => {
      const el = cloned as HTMLElement
      el.style.transform = 'none'
      el.style.boxShadow = 'none'
      el.style.borderRadius = '0'
      el.style.outline = 'none'
      el.style.overflow = 'hidden'
      el.querySelectorAll('.canvas-element').forEach((node) => {
        const item = node as HTMLElement
        item.classList.remove('selected')
        item.style.outline = 'none'
      })
    },
  }

  let canvas: HTMLCanvasElement
  try {
    // Browser-native layout — matches on-screen rendering
    canvas = await html2canvas(element, { ...options, foreignObjectRendering: true })
    if (!canvas.width || !canvas.height) throw new Error('empty canvas')
  } catch {
    canvas = await html2canvas(element, { ...options, foreignObjectRendering: false })
  }

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase()
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function exportMultipleCanvases(
  items: { element: HTMLElement; filename: string; width?: number; height?: number }[],
): Promise<void> {
  for (const { element, filename, width, height } of items) {
    await exportCanvasToPng(element, filename, 2, width, height)
    await sleep(400)
  }
}
