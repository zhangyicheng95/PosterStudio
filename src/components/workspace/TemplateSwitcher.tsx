import { LayoutTemplate } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

interface TemplateOption {
  templateId: string
  name: string
}

interface TemplateSwitcherProps {
  variants: TemplateOption[]
  activeTemplateId: string | null
  onSwitch: (templateId: string) => void
}

export function TemplateSwitcher({ variants, activeTemplateId, onSwitch }: TemplateSwitcherProps) {
  const { t } = useTranslation()

  if (variants.length === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-white">
      <LayoutTemplate className="h-4 w-4 text-slate-400 shrink-0" />
      <span className="text-xs font-medium text-slate-500 shrink-0">{t('workspace.template')}:</span>
      <div className="flex gap-1.5 overflow-x-auto">
        {variants.map((v) => (
          <button
            key={v.templateId}
            onClick={() => onSwitch(v.templateId)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTemplateId === v.templateId
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  )
}
