import type { AssetType, GeneratedAsset, AssetContent } from '../types'
import type { Locale } from '../i18n/types'
import { getTemplateVariantNames } from '../i18n'
import {
  createEnrollmentPoster,
  createTeacherCard,
  createCourseCard,
  createXiaohongshuCover,
  createMomentsBanner,
} from '../templates'

const ASSET_GENERATORS: Record<AssetType, (content: AssetContent, locale: Locale) => GeneratedAsset[]> = {
  'enrollment-poster': (content, locale) =>
    ['classic', 'warm', 'fresh'].map((v) => {
      const t = createEnrollmentPoster(content, v, locale)
      return { id: t.id, assetType: t.assetType, templateId: t.id, name: t.name, elements: t.elements, background: t.background, width: t.width, height: t.height }
    }),
  'teacher-card': (content, locale) =>
    ['modern', 'dark', 'accent'].map((v) => {
      const t = createTeacherCard(content, v, locale)
      return { id: t.id, assetType: t.assetType, templateId: t.id, name: t.name, elements: t.elements, background: t.background, width: t.width, height: t.height }
    }),
  'course-card': (content, locale) =>
    ['standard', 'compact'].map((v) => {
      const t = createCourseCard(content, v, locale)
      return { id: t.id, assetType: t.assetType, templateId: t.id, name: t.name, elements: t.elements, background: t.background, width: t.width, height: t.height }
    }),
  'xiaohongshu-cover': (content, locale) =>
    ['bold', 'minimal', 'vibrant'].map((v) => {
      const t = createXiaohongshuCover(content, v, locale)
      return { id: t.id, assetType: t.assetType, templateId: t.id, name: t.name, elements: t.elements, background: t.background, width: t.width, height: t.height }
    }),
  'moments-banner': (content, locale) =>
    ['professional', 'bright', 'clean'].map((v) => {
      const t = createMomentsBanner(content, v, locale)
      return { id: t.id, assetType: t.assetType, templateId: t.id, name: t.name, elements: t.elements, background: t.background, width: t.width, height: t.height }
    }),
}

export function generateAllAssets(content: AssetContent, locale: Locale = 'en'): GeneratedAsset[] {
  const types: AssetType[] = [
    'enrollment-poster',
    'teacher-card',
    'course-card',
    'xiaohongshu-cover',
    'moments-banner',
  ]
  return types.map((type) => ASSET_GENERATORS[type](content, locale)[0])
}

export function getTemplateVariants(assetType: AssetType, content: AssetContent, locale: Locale = 'en'): GeneratedAsset[] {
  return ASSET_GENERATORS[assetType](content, locale)
}

export function getTemplateOptions(
  assetType: AssetType,
  locale: Locale = 'en',
): { templateId: string; name: string }[] {
  const names = getTemplateVariantNames(locale)
  const options: Record<AssetType, { templateId: string; name: string }[]> = {
    'enrollment-poster': [
      { templateId: 'enrollment-poster-classic', name: names.enrollmentPoster.classic },
      { templateId: 'enrollment-poster-warm', name: names.enrollmentPoster.warm },
      { templateId: 'enrollment-poster-fresh', name: names.enrollmentPoster.fresh },
    ],
    'teacher-card': [
      { templateId: 'teacher-card-modern', name: names.teacherCard.modern },
      { templateId: 'teacher-card-dark', name: names.teacherCard.dark },
      { templateId: 'teacher-card-accent', name: names.teacherCard.accent },
    ],
    'course-card': [
      { templateId: 'course-card-standard', name: names.courseCard.standard },
      { templateId: 'course-card-compact', name: names.courseCard.compact },
    ],
    'xiaohongshu-cover': [
      { templateId: 'xiaohongshu-bold', name: names.xiaohongshu.bold },
      { templateId: 'xiaohongshu-minimal', name: names.xiaohongshu.minimal },
      { templateId: 'xiaohongshu-vibrant', name: names.xiaohongshu.vibrant },
    ],
    'moments-banner': [
      { templateId: 'moments-professional', name: names.moments.professional },
      { templateId: 'moments-bright', name: names.moments.bright },
      { templateId: 'moments-clean', name: names.moments.clean },
    ],
  }
  return options[assetType]
}

export function switchTemplate(
  assetType: AssetType,
  templateId: string,
  content: AssetContent,
  locale: Locale = 'en',
): GeneratedAsset | null {
  const variants = getTemplateVariants(assetType, content, locale)
  return variants.find((v) => v.templateId === templateId) ?? variants[0] ?? null
}
