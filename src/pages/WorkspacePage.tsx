import { useRef, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Home } from 'lucide-react'
import { AssetTypeList } from '../components/workspace/AssetTypeList'
import { CanvasEditor } from '../components/workspace/CanvasEditor'
import { PropertyPanel } from '../components/workspace/PropertyPanel'
import { TemplateSwitcher } from '../components/workspace/TemplateSwitcher'
import { Toolbar } from '../components/workspace/Toolbar'
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher'
import { useWorkspaceStore } from '../store/workspaceStore'
import { useLocaleStore } from '../store/localeStore'
import { getTemplateVariants } from '../utils/generateAssets'
import { useTranslation } from '../hooks/useTranslation'
import type { AssetType } from '../types'

export function WorkspacePage() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const locale = useLocaleStore((s) => s.locale)
  const { t, assetLabel } = useTranslation()
  const {
    activeAssetType,
    selectedElementId,
    zoom,
    content,
    assets,
    hasGenerated,
    setActiveAssetType,
    setSelectedElement,
    updateElement,
    setZoom,
    setContent,
    switchActiveTemplate,
  } = useWorkspaceStore()

  const activeAsset = useMemo(
    () => assets.find((a) => a.assetType === activeAssetType) ?? null,
    [assets, activeAssetType],
  )

  const variants = useMemo(
    () => getTemplateVariants(activeAssetType, content, locale),
    [activeAssetType, content, locale],
  )

  const selectedElement = useMemo(
    () => activeAsset?.elements.find((el) => el.id === selectedElementId) ?? null,
    [activeAsset, selectedElementId],
  )

  useEffect(() => {
    if (!hasGenerated) {
      window.location.href = '/upload'
    }
  }, [hasGenerated])

  const handleContentUpdate = (partial: Partial<typeof content>) => {
    setContent(partial)
    const updated = { ...content, ...partial }
    const fieldKeys = Object.keys(partial) as (keyof typeof content)[]
    if (activeAsset && selectedElementId) {
      const el = activeAsset.elements.find((e) => e.id === selectedElementId)
      if (el?.fieldKey && fieldKeys.includes(el.fieldKey as keyof typeof content)) {
        const value = partial[el.fieldKey as keyof typeof partial]
        if (el.type === 'text') updateElement(el.id, { content: String(value) })
        if (el.type === 'image') updateElement(el.id, { src: String(value) })
      }
    }
    fieldKeys.forEach((key) => {
      const value = updated[key]
      activeAsset?.elements.forEach((el) => {
        if (el.fieldKey === key) {
          if (el.type === 'text') updateElement(el.id, { content: String(value) })
          if (el.type === 'image') updateElement(el.id, { src: String(value) })
        }
      })
    })
  }

  if (!hasGenerated) return null

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">{t('workspace.title')}</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500">{t('workspace.breadcrumb')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AssetTypeList
          activeType={activeAssetType}
          onSelect={(type: AssetType) => setActiveAssetType(type)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Toolbar
            assetName={assetLabel(activeAssetType)}
            zoom={zoom}
            onZoomIn={() => setZoom(zoom + 0.05)}
            onZoomOut={() => setZoom(zoom - 0.05)}
            onResetZoom={() => setZoom(0.45)}
          />
          <TemplateSwitcher
            variants={variants}
            activeTemplateId={activeAsset?.templateId ?? null}
            onSwitch={switchActiveTemplate}
          />
          <CanvasEditor
            asset={activeAsset}
            zoom={zoom}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElement}
            onUpdateElement={updateElement}
            canvasRef={canvasRef}
          />
        </div>

        <PropertyPanel
          selectedElement={selectedElement}
          content={content}
          onUpdateElement={updateElement}
          onUpdateContent={handleContentUpdate}
        />
      </div>
    </div>
  )
}
