import { create } from 'zustand'
import type { AssetType, AssetContent, GeneratedAsset, CanvasElement } from '../types'
import { getDefaultContent, getContentFromSelection } from '../mock'
import { generateAllAssets, switchTemplate } from '../utils/generateAssets'
import { cloneElements, updateElementById } from '../utils/canvas'
import { useLocaleStore } from './localeStore'

interface WorkspaceState {
  content: AssetContent
  assets: GeneratedAsset[]
  activeAssetType: AssetType
  selectedElementId: string | null
  zoom: number
  isGenerating: boolean
  hasGenerated: boolean
  uploadedScreenshot: string | null
  uploadedRecording: string | null
  selectedTeacherId: string
  selectedCourseId: string
  selectedInstitutionId: string
  selectedScreenshotId: string

  setActiveAssetType: (type: AssetType) => void
  setSelectedElement: (id: string | null) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  setZoom: (zoom: number) => void
  setContent: (content: Partial<AssetContent>) => void
  generateAssets: () => Promise<void>
  regenerateForLocale: () => void
  switchActiveTemplate: (templateId: string) => void
  setUploads: (screenshot: string | null, recording: string | null) => void
  setSelections: (teacherId: string, courseId: string, institutionId: string, screenshotId: string) => void
  getActiveAsset: () => GeneratedAsset | null
  reset: () => void
}

function buildContentFromState(state: WorkspaceState) {
  const locale = useLocaleStore.getState().locale
  let content = getContentFromSelection(
    state.selectedTeacherId,
    state.selectedCourseId,
    state.selectedInstitutionId,
    state.selectedScreenshotId,
    locale,
  )
  if (state.uploadedScreenshot) {
    content = { ...content, classroomScreenshot: state.uploadedScreenshot }
  }
  return content
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  content: getDefaultContent(useLocaleStore.getState().locale),
  assets: [],
  activeAssetType: 'enrollment-poster',
  selectedElementId: null,
  zoom: 0.45,
  isGenerating: false,
  hasGenerated: false,
  uploadedScreenshot: null,
  uploadedRecording: null,
  selectedTeacherId: 't1',
  selectedCourseId: 'c1',
  selectedInstitutionId: 'i1',
  selectedScreenshotId: 'ss1',

  setActiveAssetType: (type) => set({ activeAssetType: type, selectedElementId: null }),

  setSelectedElement: (id) => set({ selectedElementId: id }),

  updateElement: (id, updates) => {
    const { assets, activeAssetType } = get()
    set({
      assets: assets.map((asset) =>
        asset.assetType === activeAssetType
          ? { ...asset, elements: updateElementById(asset.elements, id, updates) }
          : asset,
      ),
    })
  },

  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(1.2, zoom)) }),

  setContent: (partial) => {
    const content = { ...get().content, ...partial }
    const fieldKeys = Object.keys(partial) as (keyof AssetContent)[]
    set({
      content,
      assets: get().assets.map((asset) => ({
        ...asset,
        elements: asset.elements.map((el) => {
          if (!el.fieldKey || !fieldKeys.includes(el.fieldKey as keyof AssetContent)) return el
          const value = content[el.fieldKey as keyof AssetContent]
          if (el.type === 'text') return { ...el, content: String(value) }
          if (el.type === 'image') return { ...el, src: String(value) }
          return el
        }),
      })),
    })
  },

  generateAssets: async () => {
    set({ isGenerating: true })
    await new Promise((r) => setTimeout(r, 2200))
    const state = get()
    const locale = useLocaleStore.getState().locale
    const content = buildContentFromState(state)
    const assets = generateAllAssets(content, locale)
    set({ content, assets, isGenerating: false, hasGenerated: true })
  },

  regenerateForLocale: () => {
    const state = get()
    if (!state.hasGenerated) return
    const locale = useLocaleStore.getState().locale
    const content = buildContentFromState(state)
    const assets = generateAllAssets(content, locale)
    set({ content, assets, selectedElementId: null })
  },

  switchActiveTemplate: (templateId) => {
    const { assets, activeAssetType, content } = get()
    const locale = useLocaleStore.getState().locale
    const current = assets.find((a) => a.assetType === activeAssetType)
    const newTemplate = switchTemplate(activeAssetType, templateId, content, locale)
    if (!newTemplate || !current) return

    const mergedElements = newTemplate.elements.map((newEl) => {
      const existing = current.elements.find((e) => e.id === newEl.id || e.fieldKey === newEl.fieldKey)
      if (existing && !existing.locked) {
        return {
          ...newEl,
          x: existing.x,
          y: existing.y,
          width: existing.width,
          height: existing.height,
          content: existing.content ?? newEl.content,
          src: existing.src ?? newEl.src,
          style: { ...newEl.style, ...existing.style },
        }
      }
      return newEl
    })

    set({
      assets: assets.map((a) =>
        a.assetType === activeAssetType
          ? { ...newTemplate, elements: mergedElements }
          : a,
      ),
      selectedElementId: null,
    })
  },

  setUploads: (screenshot, recording) => set({ uploadedScreenshot: screenshot, uploadedRecording: recording }),

  setSelections: (teacherId, courseId, institutionId, screenshotId) =>
    set({ selectedTeacherId: teacherId, selectedCourseId: courseId, selectedInstitutionId: institutionId, selectedScreenshotId: screenshotId }),

  getActiveAsset: () => {
    const { assets, activeAssetType } = get()
    return assets.find((a) => a.assetType === activeAssetType) ?? null
  },

  reset: () => {
    const locale = useLocaleStore.getState().locale
    set({
      content: getDefaultContent(locale),
      assets: [],
      activeAssetType: 'enrollment-poster',
      selectedElementId: null,
      zoom: 0.45,
      isGenerating: false,
      hasGenerated: false,
      uploadedScreenshot: null,
      uploadedRecording: null,
    })
  },
}))

export function getActiveAssetElements(): CanvasElement[] {
  const asset = useWorkspaceStore.getState().getActiveAsset()
  return asset ? cloneElements(asset.elements) : []
}
