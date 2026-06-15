import html2canvas from 'html2canvas'

export async function exportCanvasToPng(
  element: HTMLElement,
  filename: string,
  scale = 2,
): Promise<void> {
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
