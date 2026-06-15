import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, Layers, Download, Wand2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Header } from '../components/layout/Header'
import { useTranslation } from '../hooks/useTranslation'
import { ASSET_TYPE_DIMENSIONS } from '../types'
import type { AssetType } from '../types'

const TEMPLATE_TYPES: { key: AssetType; color: string }[] = [
  { key: 'enrollment-poster', color: 'from-indigo-500 to-purple-600' },
  { key: 'teacher-card', color: 'from-slate-600 to-slate-800' },
  { key: 'course-card', color: 'from-emerald-500 to-teal-600' },
  { key: 'xiaohongshu-cover', color: 'from-amber-400 to-orange-500' },
  { key: 'moments-banner', color: 'from-blue-600 to-indigo-700' },
]

export function HomePage() {
  const { t, assetLabel } = useTranslation()

  const features = [
    { icon: <Zap className="h-5 w-5" />, title: t('home.features.instant.title'), description: t('home.features.instant.description') },
    { icon: <Layers className="h-5 w-5" />, title: t('home.features.multiPlatform.title'), description: t('home.features.multiPlatform.description') },
    { icon: <Wand2 className="h-5 w-5" />, title: t('home.features.liveEditing.title'), description: t('home.features.liveEditing.description') },
    { icon: <Download className="h-5 w-5" />, title: t('home.features.export.title'), description: t('home.features.export.description') },
  ]

  const steps = [
    { num: '01', title: t('home.steps.upload.title'), desc: t('home.steps.upload.desc') },
    { num: '02', title: t('home.steps.generate.title'), desc: t('home.steps.generate.desc') },
    { num: '03', title: t('home.steps.customize.title'), desc: t('home.steps.customize.desc') },
    { num: '04', title: t('home.steps.export.title'), desc: t('home.steps.export.desc') },
  ]

  const templates = TEMPLATE_TYPES.map(({ key, color }) => {
    const dims = ASSET_TYPE_DIMENSIONS[key]
    return { name: assetLabel(key), size: `${dims.width}×${dims.height}`, color }
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm text-brand-700 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            {t('home.badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('home.heroTitle1')}<br />
            <span className="text-brand-600">{t('home.heroTitle2')}</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('home.heroSubtitle')}<br />
            {t('home.heroSubtitle2')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/upload">
              <Button size="lg" className="shadow-lg shadow-brand-600/20">
                {t('common.tryDemo')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">{t('home.seeHowItWorks')}</Button>
            </a>
          </div>

          <div className="mt-16 relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-slate-400 ml-2">{t('home.mockWorkspace')}</span>
              </div>
              <div className="flex h-80">
                <div className="w-44 border-r border-slate-100 bg-slate-50/50 p-3 space-y-2">
                  {templates.slice(0, 4).map((tmpl) => (
                    <div key={tmpl.name} className="rounded-lg bg-white border border-slate-100 px-2.5 py-2 text-left">
                      <div className="text-[10px] font-medium text-slate-700">{tmpl.name}</div>
                      <div className="text-[9px] text-slate-400">{tmpl.size}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 flex items-center justify-center bg-[#e8eaed] p-6">
                  <div className={`w-36 h-52 rounded-lg bg-gradient-to-br ${templates[0].color} shadow-lg flex flex-col justify-end p-3`}>
                    <div className="text-[8px] text-white/80 font-medium">{t('home.mockCourse')}</div>
                    <div className="text-[10px] text-white font-bold mt-0.5">{t('home.mockEnroll')}</div>
                  </div>
                </div>
                <div className="w-44 border-l border-slate-100 p-3 space-y-2">
                  <div className="text-[9px] font-semibold text-slate-400 uppercase">{t('properties.title')}</div>
                  <div className="h-6 rounded bg-slate-100 shimmer" />
                  <div className="h-6 rounded bg-slate-100 shimmer" />
                  <div className="h-6 rounded bg-slate-100 shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{t('home.featuresTitle')}</h2>
            <p className="mt-3 text-slate-500">{t('home.featuresSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{t('home.howTitle')}</h2>
            <p className="mt-3 text-slate-500">{t('home.howSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-4xl font-bold text-brand-100 mb-3">{s.num}</div>
                <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="py-24 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{t('home.templatesTitle')}</h2>
            <p className="mt-3 text-slate-500">{t('home.templatesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {templates.map((tmpl) => (
              <div key={tmpl.name} className="group cursor-default">
                <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${tmpl.color} shadow-sm group-hover:shadow-md transition-shadow flex items-end p-3`}>
                  <span className="text-[10px] text-white/70 font-medium">{tmpl.size}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-700 text-center">{tmpl.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t('home.ctaTitle')}</h2>
          <p className="mt-3 text-slate-500">{t('home.ctaSubtitle')}</p>
          <Link to="/upload" className="inline-block mt-8">
            <Button size="lg" className="shadow-lg shadow-brand-600/20">
              {t('common.tryDemo')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-sm text-slate-400">
          <span>{t('common.copyright')}</span>
          <span>{t('common.demoPrototype')}</span>
        </div>
      </footer>
    </div>
  )
}
