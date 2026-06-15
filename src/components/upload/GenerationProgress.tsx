import { Check, Loader2 } from 'lucide-react'
import type { AssetType } from '../../types'
import { useTranslation } from '../../hooks/useTranslation'

const STEPS: AssetType[] = [
  'enrollment-poster',
  'teacher-card',
  'course-card',
  'xiaohongshu-cover',
  'moments-banner',
]

interface GenerationProgressProps {
  isGenerating: boolean
  currentStep: number
}

export function GenerationProgress({ isGenerating, currentStep }: GenerationProgressProps) {
  const { t, assetLabel } = useTranslation()

  if (!isGenerating) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="h-5 w-5 text-brand-600 animate-spin" />
          <h3 className="text-lg font-semibold text-slate-900">{t('upload.generating')}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">{t('upload.generatingDesc')}</p>
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  active ? 'bg-brand-50' : done ? 'opacity-60' : 'opacity-30'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    done ? 'bg-emerald-500 text-white' : active ? 'bg-brand-600 text-white' : 'bg-slate-200'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
                </div>
                <span className={`text-sm ${active ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                  {assetLabel(step)}
                </span>
                {active && <Loader2 className="h-3.5 w-3.5 text-brand-600 animate-spin ml-auto" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
