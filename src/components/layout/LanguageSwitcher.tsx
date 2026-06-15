import { Globe } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import type { Locale } from '../../i18n/types'

interface LanguageSwitcherProps {
  compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation()

  const options: { value: Locale; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'zh', label: '中文' },
  ]

  if (compact) {
    return (
      <button
        onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title={locale === 'en' ? 'Switch to 中文' : 'Switch to English'}
      >
        <Globe className="h-4 w-4" />
        {locale === 'en' ? '中文' : 'EN'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 bg-slate-50">
      <Globe className="h-3.5 w-3.5 text-slate-400 ml-2" />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLocale(opt.value)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            locale === opt.value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
