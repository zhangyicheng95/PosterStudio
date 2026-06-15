import { useCallback } from 'react'
import { translate, getAssetTypeKey } from '../i18n'
import { useLocaleStore } from '../store/localeStore'
import type { AssetType } from '../types'

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)
  const toggleLocale = useLocaleStore((s) => s.toggleLocale)

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale],
  )

  const assetLabel = useCallback(
    (type: AssetType) => t(getAssetTypeKey(type)),
    [t],
  )

  return { t, locale, setLocale, toggleLocale, assetLabel }
}
