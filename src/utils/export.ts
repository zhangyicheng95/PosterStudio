export async function exportCanvasToPng(
  element: HTMLElement,
  filename: string,
  scale = 2,
): Promise<void> {
  const { default: html2canvas } = await import('html2canvas')

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  })

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
  items: { element: HTMLElement; filename: string }[],
): Promise<void> {
  for (const { element, filename } of items) {
    await exportCanvasToPng(element, filename)
    await sleep(400)
  }
}
