import type { AssetType } from '../../types'
import { ASSET_TYPE_DIMENSIONS } from '../../types'
import { useTranslation } from '../../hooks/useTranslation'
import {
  Image,
  User,
  BookOpen,
  Smartphone,
  Share2,
} from 'lucide-react'

const ASSET_ICONS: Record<AssetType, React.ReactNode> = {
  'enrollment-poster': <Image className="h-4 w-4" />,
  'teacher-card': <User className="h-4 w-4" />,
  'course-card': <BookOpen className="h-4 w-4" />,
  'xiaohongshu-cover': <Smartphone className="h-4 w-4" />,
  'moments-banner': <Share2 className="h-4 w-4" />,
}

const ASSET_ORDER: AssetType[] = [
  'enrollment-poster',
  'teacher-card',
  'course-card',
  'xiaohongshu-cover',
  'moments-banner',
]

interface AssetTypeListProps {
  activeType: AssetType
  onSelect: (type: AssetType) => void
}

export function AssetTypeList({ activeType, onSelect }: AssetTypeListProps) {
  const { t, assetLabel } = useTranslation()

  return (
    <aside className="flex w-full lg:w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-50/50">
      <div className="px-4 py-4 border-b border-slate-200">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('workspace.assetTypes')}</h2>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {ASSET_ORDER.map((type) => {
          const dims = ASSET_TYPE_DIMENSIONS[type]
          const isActive = activeType === type
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                isActive
                  ? 'bg-white shadow-sm border border-slate-200 text-slate-900'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <span className={`mt-0.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>
                {ASSET_ICONS[type]}
              </span>
              <div>
                <div className="text-sm font-medium">{assetLabel(type)}</div>
                <div className="text-xs text-slate-400 mt-0.5">{dims.width}×{dims.height}</div>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
