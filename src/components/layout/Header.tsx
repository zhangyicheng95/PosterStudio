import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '../../hooks/useTranslation'

interface HeaderProps {
  showCta?: boolean
}

export function Header({ showCta = true }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm group-hover:bg-brand-700 transition-colors">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900">{t('common.brand')}</span>
            <span className="text-sm font-normal text-slate-400 ml-1">{t('common.product')}</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
          <a href="#features" className="hover:text-slate-900 transition-colors">{t('nav.features')}</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">{t('nav.howItWorks')}</a>
          <a href="#templates" className="hover:text-slate-900 transition-colors">{t('nav.templates')}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {showCta && (
            <Link to="/upload">
              <Button size="sm">{t('common.tryDemo')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
