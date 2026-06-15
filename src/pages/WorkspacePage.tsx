import { useRef, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Home, Layers, Paintbrush, Settings2 } from 'lucide-react'
import { AssetTypeList } from '../components/workspace/AssetTypeList'
import { CanvasEditor } from '../components/workspace/CanvasEditor'
import { PropertyPanel } from '../components/workspace/PropertyPanel'
import { TemplateSwitcher } from '../components/workspace/TemplateSwitcher'
import { Toolbar } from '../components/workspace/Toolbar'
import { HiddenExportCanvases } from '../components/workspace/AssetCanvas'
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher'
import { useWorkspaceStore } from '../store/workspaceStore'
import { useLocaleStore } from '../store/localeStore'
import { getTemplateOptions } from '../utils/generateAssets'
import { useTranslation } from '../hooks/useTranslation'
import { useWorkspaceShortcuts } from '../hooks/useWorkspaceShortcuts'
import { useCanvasExport } from '../hooks/useCanvasExport'
import type { AssetType } from '../types'

const ASSET_TYPES: AssetType[] = [
  'enrollment-poster',
  'teacher-card',
  'course-card',
  'xiaohongshu-cover',
  'moments-banner',
]

type MobilePanel = 'assets' | 'canvas' | 'properties'

export function WorkspacePage() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const locale = useLocaleStore((s) => s.locale)
  const { t, assetLabel } = useTranslation()
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('canvas')

  const activeAssetType = useWorkspaceStore((s) => s.activeAssetType)
  const selectedElementId = useWorkspaceStore((s) => s.selectedElementId)
  const zoom = useWorkspaceStore((s) => s.zoom)
  const content = useWorkspaceStore((s) => s.content)
  const assets = useWorkspaceStore((s) => s.assets)
  const setActiveAssetType = useWorkspaceStore((s) => s.setActiveAssetType)
  const setSelectedElement = useWorkspaceStore((s) => s.setSelectedElement)
  const updateElement = useWorkspaceStore((s) => s.updateElement)
  const setZoom = useWorkspaceStore((s) => s.setZoom)
  const setContent = useWorkspaceStore((s) => s.setContent)
  const switchActiveTemplate = useWorkspaceStore((s) => s.switchActiveTemplate)

  const activeAsset = useMemo(
    () => assets.find((a) => a.assetType === activeAssetType) ?? null,
    [assets, activeAssetType],
  )

  const templateOptions = useMemo(
    () => getTemplateOptions(activeAssetType, locale),
    [activeAssetType, locale],
  )

  const selectedElement = useMemo(
    () => activeAsset?.elements.find((el) => el.id === selectedElementId) ?? null,
    [activeAsset, selectedElementId],
  )

  const { exportPng, exportAll } = useCanvasExport()

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('[data-export-canvas="active"]') as HTMLElement | null
    exportPng(canvas, assetLabel(activeAssetType))
  }, [exportPng, assetLabel, activeAssetType])

  const handleExportAll = useCallback(() => {
    exportAll(ASSET_TYPES, assetLabel)
  }, [exportAll, assetLabel])

  useWorkspaceShortcuts({ onExport: handleExport, onExportAll: handleExportAll })

  return (
    <div className="flex h-screen flex-col bg-white">
      <HiddenExportCanvases assets={assets} />

      <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">{t('workspace.title')}</span>
          </Link>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-sm text-slate-500 hidden sm:inline">{t('workspace.breadcrumb')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${mobilePanel === 'assets' ? 'flex' : 'hidden'} lg:flex w-full lg:w-56 shrink-0 flex-col`}>
          <AssetTypeList
            activeType={activeAssetType}
            onSelect={(type: AssetType) => {
              setActiveAssetType(type)
              setMobilePanel('canvas')
            }}
          />
        </div>

        <div className={`${mobilePanel === 'canvas' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col overflow-hidden`}>
          <Toolbar
            assetName={assetLabel(activeAssetType)}
            assetTypes={ASSET_TYPES}
            zoom={zoom}
            canvasRef={canvasRef}
            onZoomIn={() => setZoom(zoom + 0.05)}
            onZoomOut={() => setZoom(zoom - 0.05)}
            onResetZoom={() => setZoom(0.45)}
          />
          <TemplateSwitcher
            variants={templateOptions}
            activeTemplateId={activeAsset?.templateId ?? null}
            onSwitch={switchActiveTemplate}
          />
          <p className="hidden lg:block px-4 py-1 text-[10px] text-slate-400 border-b border-slate-100 bg-white">
            {t('workspace.shortcuts')}
          </p>
          <CanvasEditor
            asset={activeAsset}
            zoom={zoom}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElement}
            onUpdateElement={updateElement}
            canvasRef={canvasRef}
          />
        </div>

        <div className={`${mobilePanel === 'properties' ? 'flex' : 'hidden'} lg:flex w-full lg:w-72 shrink-0 flex-col`}>
          <PropertyPanel
            selectedElement={selectedElement}
            content={content}
            onUpdateElement={updateElement}
            onUpdateContent={setContent}
          />
        </div>
      </div>

      <nav className="flex lg:hidden border-t border-slate-200 bg-white shrink-0">
        {([
          { id: 'assets' as const, icon: Layers, label: t('workspace.assetTypes') },
          { id: 'canvas' as const, icon: Paintbrush, label: t('workspace.breadcrumb') },
          { id: 'properties' as const, icon: Settings2, label: t('properties.title') },
        ]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMobilePanel(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
              mobilePanel === id ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
