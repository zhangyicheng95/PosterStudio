import en from './locales/en'
import zh from './locales/zh'
import type { Locale, TemplateLabels, TemplateVariantNames } from './types'
import type { AssetType } from '../types'

export type { Locale, TemplateLabels, TemplateVariantNames }

const locales = { en, zh } as const

export function getLocaleDict(locale: Locale) {
  return locales[locale]
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const keys = key.split('.')
  let value: unknown = locales[locale]
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k]
  }
  if (typeof value !== 'string') {
    value = locales.en
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
  }
  let text = typeof value === 'string' ? value : key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
    }
  }
  return text
}

export function getAssetTypeKey(type: AssetType): string {
  const map: Record<AssetType, string> = {
    'enrollment-poster': 'assets.enrollmentPoster',
    'teacher-card': 'assets.teacherCard',
    'course-card': 'assets.courseCard',
    'xiaohongshu-cover': 'assets.xiaohongshuCover',
    'moments-banner': 'assets.momentsBanner',
  }
  return map[type]
}

export function getTemplateLabels(locale: Locale): TemplateLabels {
  const labels = locales[locale].templates.labels
  return { ...labels }
}

export function getTemplateVariantNames(locale: Locale): TemplateVariantNames {
  const t = locales[locale].templates
  return {
    enrollmentPoster: { ...t.enrollmentPoster },
    teacherCard: { ...t.teacherCard },
    courseCard: { ...t.courseCard },
    xiaohongshu: { ...t.xiaohongshu },
    moments: { ...t.moments },
  }
}

export function getCategoryLabel(locale: Locale, category: string): string {
  const categories = locales[locale].categories as Record<string, string>
  return categories[category] ?? category
}
