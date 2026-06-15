import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '../i18n/types'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

function detectLocale(): Locale {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.toLowerCase()
    if (lang.startsWith('zh')) return 'zh'
  }
  return 'en'
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: detectLocale(),
      setLocale: (locale) => {
        document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
        set({ locale })
      },
      toggleLocale: () => {
        const next = get().locale === 'en' ? 'zh' : 'en'
        get().setLocale(next)
      },
    }),
    {
      name: 'classin-locale',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.lang = state.locale === 'zh' ? 'zh-CN' : 'en'
        }
      },
    },
  ),
)
