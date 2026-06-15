import type { AssetContent, CanvasElement, Template } from '../types'
import type { TemplateLabels, TemplateVariantNames } from '../i18n/types'
import { getTemplateLabels, getTemplateVariantNames } from '../i18n'
import type { Locale } from '../i18n/types'

function el(partial: CanvasElement): CanvasElement {
  return partial
}

function applyContent(elements: CanvasElement[], content: AssetContent): CanvasElement[] {
  const fieldMap: Record<string, string | number> = {
    courseName: content.courseName,
    teacherName: content.teacherName,
    teacherAvatar: content.teacherAvatar,
    teacherExperience: content.teacherExperience,
    teachingStyle: content.teachingStyle,
    courseCount: content.courseCount,
    studentCount: content.studentCount,
    classroomScreenshot: content.classroomScreenshot,
    institutionLogo: content.institutionLogo,
    institutionName: content.institutionName,
    slogan: content.slogan,
    qrCode: content.qrCode,
    courseCover: content.courseCover,
    courseIntroduction: content.courseIntroduction,
    price: content.price,
    schedule: content.schedule,
    headline: content.headline,
    cta: content.cta,
  }

  return elements.map((element) => {
    if (!element.fieldKey) return { ...element }
    const value = fieldMap[element.fieldKey]
    if (value === undefined) return { ...element }
    if (element.type === 'text' || element.type === 'qrcode') {
      return { ...element, content: String(value) }
    }
    if (element.type === 'image') {
      return { ...element, src: String(value) }
    }
    return { ...element }
  })
}

interface TemplateContext {
  labels: TemplateLabels
  names: TemplateVariantNames
}

function getContext(locale: Locale): TemplateContext {
  return {
    labels: getTemplateLabels(locale),
    names: getTemplateVariantNames(locale),
  }
}

export function createEnrollmentPoster(
  content: AssetContent,
  variant = 'classic',
  locale: Locale = 'en',
): Template {
  const { labels, names } = getContext(locale)
  const backgrounds: Record<string, string> = {
    classic: 'linear-gradient(165deg, #6366f1 0%, #4f46e5 40%, #312e81 100%)',
    warm: 'linear-gradient(165deg, #f97316 0%, #ea580c 40%, #9a3412 100%)',
    fresh: 'linear-gradient(165deg, #10b981 0%, #059669 40%, #064e3b 100%)',
  }

  const variantNames: Record<string, string> = names.enrollmentPoster

  const elements: CanvasElement[] = [
    el({ id: 'bg-shape', type: 'shape', x: 0, y: 0, width: 750, height: 400, style: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 0 }, locked: true }),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 40, y: 40, width: 64, height: 64, style: { borderRadius: 12, objectFit: 'cover' } }),
    el({ id: 'inst-name', type: 'text', fieldKey: 'institutionName', x: 120, y: 52, width: 400, height: 40, content: content.institutionName, style: { fontSize: 22, fontWeight: 600, color: '#ffffff' } }),
    el({ id: 'course-name', type: 'text', fieldKey: 'courseName', x: 40, y: 130, width: 670, height: 80, content: content.courseName, style: { fontSize: 36, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 } }),
    el({ id: 'slogan', type: 'text', fieldKey: 'slogan', x: 40, y: 220, width: 500, height: 30, content: content.slogan, style: { fontSize: 16, color: 'rgba(255,255,255,0.85)' } }),
    el({ id: 'screenshot', type: 'image', fieldKey: 'classroomScreenshot', x: 40, y: 280, width: 670, height: 420, style: { borderRadius: 16, objectFit: 'cover' } }),
    el({ id: 'teacher-avatar', type: 'image', fieldKey: 'teacherAvatar', x: 40, y: 730, width: 80, height: 80, style: { borderRadius: 40, objectFit: 'cover' } }),
    el({ id: 'teacher-name', type: 'text', fieldKey: 'teacherName', x: 140, y: 740, width: 300, height: 30, content: content.teacherName, style: { fontSize: 20, fontWeight: 600, color: '#ffffff' } }),
    el({ id: 'teacher-exp', type: 'text', fieldKey: 'teacherExperience', x: 140, y: 775, width: 400, height: 24, content: content.teacherExperience, style: { fontSize: 14, color: 'rgba(255,255,255,0.75)' } }),
    el({ id: 'qr', type: 'image', fieldKey: 'qrCode', x: 580, y: 720, width: 130, height: 130, style: { borderRadius: 8, objectFit: 'cover', backgroundColor: '#ffffff' } }),
    el({ id: 'scan-text', type: 'text', x: 580, y: 860, width: 130, height: 20, content: labels.scanToEnroll, style: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }, locked: true }),
    el({ id: 'cta-badge', type: 'shape', x: 40, y: 900, width: 200, height: 44, style: { backgroundColor: '#ffffff', borderRadius: 22 } }),
    el({ id: 'cta-text', type: 'text', fieldKey: 'cta', x: 40, y: 908, width: 200, height: 28, content: content.cta, style: { fontSize: 14, fontWeight: 600, color: '#4f46e5', textAlign: 'center' } }),
  ]

  return {
    id: `enrollment-poster-${variant}`,
    name: variantNames[variant as keyof typeof variantNames] ?? variantNames.classic,
    assetType: 'enrollment-poster',
    width: 750,
    height: 1334,
    background: backgrounds[variant] ?? backgrounds.classic,
    elements: applyContent(elements, content),
  }
}

export function createTeacherCard(content: AssetContent, variant = 'modern', locale: Locale = 'en'): Template {
  const { labels, names } = getContext(locale)
  const backgrounds: Record<string, string> = {
    modern: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    dark: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    accent: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)',
  }
  const isDark = variant === 'dark'
  const textPrimary = isDark ? '#ffffff' : '#0f172a'
  const textSecondary = isDark ? '#94a3b8' : '#64748b'
  const variantNames = names.teacherCard

  const elements: CanvasElement[] = [
    el({ id: 'accent-bar', type: 'shape', x: 0, y: 0, width: 600, height: 6, style: { backgroundColor: '#6366f1' }, locked: true }),
    el({ id: 'avatar', type: 'image', fieldKey: 'teacherAvatar', x: 200, y: 60, width: 200, height: 200, style: { borderRadius: 100, objectFit: 'cover' } }),
    el({ id: 'name', type: 'text', fieldKey: 'teacherName', x: 40, y: 290, width: 520, height: 44, content: content.teacherName, style: { fontSize: 32, fontWeight: 700, color: textPrimary, textAlign: 'center' } }),
    el({ id: 'exp', type: 'text', fieldKey: 'teacherExperience', x: 40, y: 340, width: 520, height: 28, content: content.teacherExperience, style: { fontSize: 15, color: textSecondary, textAlign: 'center' } }),
    el({ id: 'divider', type: 'shape', x: 200, y: 390, width: 200, height: 2, style: { backgroundColor: isDark ? '#334155' : '#e2e8f0' }, locked: true }),
    el({ id: 'style-label', type: 'text', x: 40, y: 420, width: 520, height: 20, content: labels.teachingStyle, style: { fontSize: 11, fontWeight: 600, color: '#6366f1', textAlign: 'center', letterSpacing: 2 }, locked: true }),
    el({ id: 'style', type: 'text', fieldKey: 'teachingStyle', x: 40, y: 445, width: 520, height: 30, content: content.teachingStyle, style: { fontSize: 18, fontWeight: 500, color: textPrimary, textAlign: 'center' } }),
    el({ id: 'stat-box-1', type: 'shape', x: 60, y: 520, width: 220, height: 100, style: { backgroundColor: isDark ? '#334155' : '#f1f5f9', borderRadius: 12 } }),
    el({ id: 'stat-box-2', type: 'shape', x: 320, y: 520, width: 220, height: 100, style: { backgroundColor: isDark ? '#334155' : '#f1f5f9', borderRadius: 12 } }),
    el({ id: 'courses-num', type: 'text', fieldKey: 'courseCount', x: 60, y: 540, width: 220, height: 40, content: String(content.courseCount), style: { fontSize: 32, fontWeight: 700, color: '#6366f1', textAlign: 'center' } }),
    el({ id: 'courses-label', type: 'text', x: 60, y: 585, width: 220, height: 20, content: labels.courses, style: { fontSize: 13, color: textSecondary, textAlign: 'center' }, locked: true }),
    el({ id: 'students-num', type: 'text', fieldKey: 'studentCount', x: 320, y: 540, width: 220, height: 40, content: String(content.studentCount), style: { fontSize: 32, fontWeight: 700, color: '#6366f1', textAlign: 'center' } }),
    el({ id: 'students-label', type: 'text', x: 320, y: 585, width: 220, height: 20, content: labels.students, style: { fontSize: 13, color: textSecondary, textAlign: 'center' }, locked: true }),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 260, y: 680, width: 80, height: 80, style: { borderRadius: 12, objectFit: 'cover', opacity: 0.6 } }),
  ]

  return {
    id: `teacher-card-${variant}`,
    name: variantNames[variant as keyof typeof variantNames] ?? variantNames.modern,
    assetType: 'teacher-card',
    width: 600,
    height: 800,
    background: backgrounds[variant] ?? backgrounds.modern,
    elements: applyContent(elements, content),
  }
}

export function createCourseCard(content: AssetContent, variant = 'standard', locale: Locale = 'en'): Template {
  const { labels, names } = getContext(locale)
  const variantNames = names.courseCard

  const elements: CanvasElement[] = [
    el({ id: 'cover', type: 'image', fieldKey: 'courseCover', x: 0, y: 0, width: 600, height: 320, style: { objectFit: 'cover' } }),
    el({ id: 'overlay', type: 'shape', x: 0, y: 200, width: 600, height: 120, style: { backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }, locked: true }),
    el({ id: 'course-name', type: 'text', fieldKey: 'courseName', x: 30, y: 240, width: 540, height: 60, content: content.courseName, style: { fontSize: 26, fontWeight: 700, color: '#ffffff' } }),
    el({ id: 'intro-label', type: 'text', x: 30, y: 350, width: 200, height: 20, content: labels.aboutCourse, style: { fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: 1.5 }, locked: true }),
    el({ id: 'intro', type: 'text', fieldKey: 'courseIntroduction', x: 30, y: 375, width: 540, height: 80, content: content.courseIntroduction, style: { fontSize: 15, color: '#475569', lineHeight: 1.5 } }),
    el({ id: 'price-box', type: 'shape', x: 30, y: 490, width: 260, height: 80, style: { backgroundColor: '#eef2ff', borderRadius: 12 } }),
    el({ id: 'price-label', type: 'text', x: 50, y: 505, width: 100, height: 18, content: labels.tuition, style: { fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: 1 }, locked: true }),
    el({ id: 'price', type: 'text', fieldKey: 'price', x: 50, y: 525, width: 220, height: 36, content: content.price, style: { fontSize: 28, fontWeight: 700, color: '#4f46e5' } }),
    el({ id: 'schedule-box', type: 'shape', x: 310, y: 490, width: 260, height: 80, style: { backgroundColor: '#f8fafc', borderRadius: 12 } }),
    el({ id: 'schedule-label', type: 'text', x: 330, y: 505, width: 100, height: 18, content: labels.schedule, style: { fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: 1 }, locked: true }),
    el({ id: 'schedule', type: 'text', fieldKey: 'schedule', x: 330, y: 525, width: 220, height: 36, content: content.schedule, style: { fontSize: 16, fontWeight: 600, color: '#0f172a' } }),
    el({ id: 'teacher-row', type: 'shape', x: 30, y: 610, width: 540, height: 80, style: { backgroundColor: '#f8fafc', borderRadius: 12 } }),
    el({ id: 'teacher-avatar', type: 'image', fieldKey: 'teacherAvatar', x: 50, y: 625, width: 50, height: 50, style: { borderRadius: 25, objectFit: 'cover' } }),
    el({ id: 'teacher-name', type: 'text', fieldKey: 'teacherName', x: 115, y: 630, width: 300, height: 24, content: content.teacherName, style: { fontSize: 16, fontWeight: 600, color: '#0f172a' } }),
    el({ id: 'teacher-exp', type: 'text', fieldKey: 'teacherExperience', x: 115, y: 655, width: 400, height: 20, content: content.teacherExperience, style: { fontSize: 13, color: '#64748b' } }),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 500, y: 630, width: 50, height: 50, style: { borderRadius: 8, objectFit: 'cover' } }),
  ]

  return {
    id: `course-card-${variant}`,
    name: variantNames[variant as keyof typeof variantNames] ?? variantNames.standard,
    assetType: 'course-card',
    width: 600,
    height: 750,
    background: '#ffffff',
    elements: applyContent(elements, content),
  }
}

export function createXiaohongshuCover(content: AssetContent, variant = 'bold', locale: Locale = 'en'): Template {
  const { labels, names } = getContext(locale)
  const backgrounds: Record<string, string> = {
    bold: 'linear-gradient(180deg, #fef3c7 0%, #ffffff 30%)',
    minimal: '#ffffff',
    vibrant: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #dbeafe 100%)',
  }
  const variantNames = names.xiaohongshu

  const elements: CanvasElement[] = [
    el({ id: 'main-visual', type: 'image', fieldKey: 'classroomScreenshot', x: 60, y: 80, width: 960, height: 720, style: { borderRadius: 24, objectFit: 'cover' } }),
    el({ id: 'badge', type: 'shape', x: 80, y: 100, width: 120, height: 36, style: { backgroundColor: '#ef4444', borderRadius: 18 } }),
    el({ id: 'badge-text', type: 'text', x: 80, y: 108, width: 120, height: 20, content: labels.hotBadge, style: { fontSize: 14, fontWeight: 700, color: '#ffffff', textAlign: 'center' }, locked: true }),
    el({ id: 'headline', type: 'text', fieldKey: 'headline', x: 60, y: 840, width: 960, height: 120, content: content.headline, style: { fontSize: 48, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 } }),
    el({ id: 'course-name', type: 'text', fieldKey: 'courseName', x: 60, y: 980, width: 960, height: 50, content: content.courseName, style: { fontSize: 28, fontWeight: 600, color: '#6366f1' } }),
    el({ id: 'teacher-tag', type: 'shape', x: 60, y: 1060, width: 280, height: 48, style: { backgroundColor: '#f1f5f9', borderRadius: 24 } }),
    el({ id: 'teacher-avatar', type: 'image', fieldKey: 'teacherAvatar', x: 68, y: 1064, width: 40, height: 40, style: { borderRadius: 20, objectFit: 'cover' } }),
    el({ id: 'teacher-name', type: 'text', fieldKey: 'teacherName', x: 120, y: 1072, width: 200, height: 24, content: content.teacherName, style: { fontSize: 16, fontWeight: 600, color: '#334155' } }),
    el({ id: 'cta-box', type: 'shape', x: 60, y: 1200, width: 960, height: 80, style: { backgroundColor: '#6366f1', borderRadius: 16 } }),
    el({ id: 'cta', type: 'text', fieldKey: 'cta', x: 60, y: 1220, width: 960, height: 40, content: content.cta, style: { fontSize: 28, fontWeight: 700, color: '#ffffff', textAlign: 'center' } }),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 900, y: 1060, width: 48, height: 48, style: { borderRadius: 8, objectFit: 'cover' } }),
  ]

  return {
    id: `xiaohongshu-${variant}`,
    name: variantNames[variant as keyof typeof variantNames] ?? variantNames.bold,
    assetType: 'xiaohongshu-cover',
    width: 1080,
    height: 1440,
    background: backgrounds[variant] ?? backgrounds.bold,
    elements: applyContent(elements, content),
  }
}

export function createMomentsBanner(content: AssetContent, variant = 'professional', locale: Locale = 'en'): Template {
  const { labels, names } = getContext(locale)
  const backgrounds: Record<string, string> = {
    professional: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
    bright: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    clean: '#ffffff',
  }
  const isClean = variant === 'clean'
  const textColor = isClean ? '#0f172a' : '#ffffff'
  const subColor = isClean ? '#64748b' : 'rgba(255,255,255,0.8)'
  const variantNames = names.moments

  const elements: CanvasElement[] = [
    el({ id: 'visual', type: 'image', fieldKey: 'classroomScreenshot', x: isClean ? 680 : 620, y: 64, width: 480, height: 500, style: { borderRadius: 16, objectFit: 'cover' } }),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 60, y: 50, width: 48, height: 48, style: { borderRadius: 8, objectFit: 'cover' } }),
    el({ id: 'inst-name', type: 'text', fieldKey: 'institutionName', x: 120, y: 58, width: 400, height: 32, content: content.institutionName, style: { fontSize: 18, fontWeight: 600, color: textColor } }),
    el({ id: 'headline', type: 'text', fieldKey: 'headline', x: 60, y: 130, width: 520, height: 100, content: content.headline, style: { fontSize: 36, fontWeight: 700, color: textColor, lineHeight: 1.2 } }),
    el({ id: 'course-name', type: 'text', fieldKey: 'courseName', x: 60, y: 250, width: 520, height: 40, content: content.courseName, style: { fontSize: 20, fontWeight: 500, color: subColor } }),
    el({ id: 'teacher-row', type: 'shape', x: 60, y: 320, width: 320, height: 56, style: { backgroundColor: isClean ? '#f1f5f9' : 'rgba(255,255,255,0.1)', borderRadius: 28 } }),
    el({ id: 'teacher-avatar', type: 'image', fieldKey: 'teacherAvatar', x: 68, y: 326, width: 44, height: 44, style: { borderRadius: 22, objectFit: 'cover' } }),
    el({ id: 'teacher-name', type: 'text', fieldKey: 'teacherName', x: 125, y: 332, width: 240, height: 24, content: content.teacherName, style: { fontSize: 16, fontWeight: 600, color: textColor } }),
    el({ id: 'teacher-exp', type: 'text', fieldKey: 'teacherExperience', x: 125, y: 355, width: 240, height: 18, content: content.teacherExperience, style: { fontSize: 12, color: subColor } }),
    el({ id: 'price', type: 'text', fieldKey: 'price', x: 60, y: 420, width: 200, height: 44, content: content.price, style: { fontSize: 32, fontWeight: 700, color: isClean ? '#6366f1' : '#a5b4fc' } }),
    el({ id: 'schedule', type: 'text', fieldKey: 'schedule', x: 60, y: 470, width: 400, height: 24, content: content.schedule, style: { fontSize: 14, color: subColor } }),
    el({ id: 'cta-box', type: 'shape', x: 60, y: 530, width: 180, height: 44, style: { backgroundColor: isClean ? '#6366f1' : '#ffffff', borderRadius: 22 } }),
    el({ id: 'cta', type: 'text', fieldKey: 'cta', x: 60, y: 540, width: 180, height: 28, content: labels.learnMore, style: { fontSize: 15, fontWeight: 600, color: isClean ? '#ffffff' : '#4f46e5', textAlign: 'center' } }),
  ]

  return {
    id: `moments-${variant}`,
    name: variantNames[variant as keyof typeof variantNames] ?? variantNames.professional,
    assetType: 'moments-banner',
    width: 1200,
    height: 628,
    background: backgrounds[variant] ?? backgrounds.professional,
    elements: applyContent(elements, content),
  }
}

export { applyContent }
