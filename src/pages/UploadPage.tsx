import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { UploadZone } from '../components/upload/UploadZone'
import { GenerationProgress } from '../components/upload/GenerationProgress'
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher'
import { useWorkspaceStore } from '../store/workspaceStore'
import { useTranslation } from '../hooks/useTranslation'
import { teachers, courses, institutions, screenshots } from '../mock'

export function UploadPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    uploadedScreenshot,
    uploadedRecording,
    isGenerating,
    setUploads,
    setSelections,
    generateAssets,
    selectedTeacherId,
    selectedCourseId,
    selectedInstitutionId,
    selectedScreenshotId,
  } = useWorkspaceStore()

  const [genStep, setGenStep] = useState(0)

  useEffect(() => {
    if (!isGenerating) return
    setGenStep(0)
    const interval = setInterval(() => {
      setGenStep((s) => (s < 4 ? s + 1 : s))
    }, 450)
    return () => clearInterval(interval)
  }, [isGenerating])

  useEffect(() => {
    if (!isGenerating && useWorkspaceStore.getState().hasGenerated) {
      navigate('/workspace')
    }
  }, [isGenerating, navigate])

  const canGenerate = uploadedScreenshot || selectedScreenshotId

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-semibold text-slate-900">{t('upload.title')}</span>
          </div>
          <LanguageSwitcher compact />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">{t('upload.heading')}</h1>
          <p className="mt-3 text-slate-500">{t('upload.subtitle')}</p>
        </div>

        <UploadZone
          screenshot={uploadedScreenshot}
          recording={uploadedRecording}
          onScreenshotChange={(url) => setUploads(url, uploadedRecording)}
          onRecordingChange={(url) => setUploads(uploadedScreenshot, url)}
        />

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">{t('upload.demoData')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label={t('upload.teacher')}
              value={selectedTeacherId}
              options={teachers.map((te) => ({ value: te.id, label: te.name }))}
              onChange={(v) => setSelections(v, selectedCourseId, selectedInstitutionId, selectedScreenshotId)}
            />
            <Select
              label={t('upload.course')}
              value={selectedCourseId}
              options={courses.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(v) => setSelections(selectedTeacherId, v, selectedInstitutionId, selectedScreenshotId)}
            />
            <Select
              label={t('upload.institution')}
              value={selectedInstitutionId}
              options={institutions.map((i) => ({ value: i.id, label: i.name }))}
              onChange={(v) => setSelections(selectedTeacherId, selectedCourseId, v, selectedScreenshotId)}
            />
            <Select
              label={t('upload.screenshot')}
              value={selectedScreenshotId}
              options={screenshots.map((s) => ({ value: s.id, label: s.title }))}
              onChange={(v) => setSelections(selectedTeacherId, selectedCourseId, selectedInstitutionId, v)}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            onClick={() => generateAssets()}
            disabled={!canGenerate}
            className="shadow-lg shadow-brand-600/20 min-w-64"
          >
            <Sparkles className="h-4 w-4" />
            {t('upload.generate')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {!canGenerate && (
          <p className="text-center text-xs text-slate-400 mt-3">{t('upload.hint')}</p>
        )}
      </main>

      <GenerationProgress isGenerating={isGenerating} currentStep={genStep} />
    </div>
  )
}
