import { useEffect } from 'react'
import { useLocaleStore } from '../store/localeStore'
import { useWorkspaceStore } from '../store/workspaceStore'

export function LocaleSync() {
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
