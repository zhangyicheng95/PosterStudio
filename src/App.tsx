import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { UploadPage } from './pages/UploadPage'
import { WorkspacePage } from './pages/WorkspacePage'
import { useLocaleStore } from './store/localeStore'
import { useWorkspaceStore } from './store/workspaceStore'

function LocaleSync() {
  const locale = useLocaleStore((s) => s.locale)
  const hasGenerated = useWorkspaceStore((s) => s.hasGenerated)
  const regenerateForLocale = useWorkspaceStore((s) => s.regenerateForLocale)

  useEffect(() => {
    document.title = locale === 'zh'
      ? 'ClassIn 内容工作室'
      : 'ClassIn Content Studio'
  }, [locale])

  useEffect(() => {
    if (hasGenerated) {
      regenerateForLocale()
    }
  }, [locale, hasGenerated, regenerateForLocale])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleSync />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
    </BrowserRouter>
  )
}
