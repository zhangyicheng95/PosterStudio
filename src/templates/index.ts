import type { AssetContent, CanvasElement, ElementStyle, Template } from '../types'
import type { TemplateLabels, TemplateVariantNames } from '../i18n/types'
import { getTemplateLabels, getTemplateVariantNames } from '../i18n'
import type { Locale } from '../i18n/types'
import { lineBoxHeight } from '../utils/textLayout'

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

/** CTA shape + text sharing the exact same bounding box (export-safe centering). */
function ctaButton(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  content: string,
  boxStyle: ElementStyle,
  textStyle: ElementStyle,
): CanvasElement[] {
  const textBoxStyle: ElementStyle = {
    ...textStyle,
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: textStyle.lineHeight ?? 1.2,
  }
  return [
    el({ id: `${id}-box`, type: 'shape', x, y, width: w, height: h, style: boxStyle }),
    el({ id, type: 'text', fieldKey: 'cta', x, y, width: w, height: h, content, style: textBoxStyle }),
  ]
}

/** Shape + centered label sharing the exact same bounding box. */
function centeredLabel(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  content: string,
  boxStyle: ElementStyle,
  textStyle: ElementStyle,
  locked = false,
): CanvasElement[] {
  return [
    el({ id: `${id}-bg`, type: 'shape', x, y, width: w, height: h, style: boxStyle }),
    el({ id, type: 'text', x, y, width: w, height: h, content, style: { ...textStyle, textAlign: 'center', verticalAlign: 'middle', lineHeight: textStyle.lineHeight ?? 1.2 }, locked }),
  ]
}

/** Avatar + name + experience row with vertically aligned text block. */
function teacherRow(
  idPrefix: string,
  row: { x: number; y: number; width: number; height: number; style?: ElementStyle },
  avatarSize: number,
  content: AssetContent,
  nameStyle: ElementStyle,
  expStyle: ElementStyle,
  textWidth?: number,
): CanvasElement[] {
  const nameH = lineBoxHeight(nameStyle)
  const expH = lineBoxHeight(expStyle)
  const gap = 4
  const textBlockH = nameH + gap + expH
  const pad = (row.height - avatarSize) / 2
  const avatarX = row.x + pad
  const avatarY = row.y + pad
  const textX = avatarX + avatarSize + 12
  const textW = textWidth ?? row.width - (textX - row.x) - pad
  const textY = row.y + (row.height - textBlockH) / 2

  return [
    el({ id: `${idPrefix}-row`, type: 'shape', x: row.x, y: row.y, width: row.width, height: row.height, style: row.style ?? {} }),
    el({
      id: `${idPrefix}-avatar`,
      type: 'image',
      fieldKey: 'teacherAvatar',
      x: avatarX,
      y: avatarY,
      width: avatarSize,
      height: avatarSize,
      style: { borderRadius: avatarSize / 2, objectFit: 'cover' },
    }),
    el({
      id: `${idPrefix}-name`,
      type: 'text',
      fieldKey: 'teacherName',
      x: textX,
      y: textY,
      width: textW,
      height: nameH,
      content: content.teacherName,
      style: { ...nameStyle, verticalAlign: 'top' },
    }),
    el({
      id: `${idPrefix}-exp`,
      type: 'text',
      fieldKey: 'teacherExperience',
      x: textX,
      y: textY + nameH + gap,
      width: textW,
      height: expH,
      content: content.teacherExperience,
      style: { ...expStyle, verticalAlign: 'top' },
    }),
  ]
}

/** Compact teacher pill: avatar + single-line name vertically centered in tag. */
function teacherTag(
  idPrefix: string,
  x: number,
  y: number,
  w: number,
  h: number,
  avatarSize: number,
  content: AssetContent,
  boxStyle: ElementStyle,
  textStyle: ElementStyle,
): CanvasElement[] {
  const pad = (h - avatarSize) / 2
  const avatarX = x + pad
  const avatarY = y + pad
  const textX = avatarX + avatarSize + 10
  const textW = w - (textX - x) - pad

  return [
    el({ id: `${idPrefix}-tag`, type: 'shape', x, y, width: w, height: h, style: boxStyle }),
    el({
      id: `${idPrefix}-avatar`,
      type: 'image',
      fieldKey: 'teacherAvatar',
      x: avatarX,
      y: avatarY,
      width: avatarSize,
      height: avatarSize,
      style: { borderRadius: avatarSize / 2, objectFit: 'cover' },
    }),
    el({
      id: `${idPrefix}-name`,
      type: 'text',
      fieldKey: 'teacherName',
      x: textX,
      y,
      width: textW,
      height: h,
      content: content.teacherName,
      style: { ...textStyle, verticalAlign: 'middle' },
    }),
  ]
}

/** Avatar with name + experience block vertically centered beside it. */
function teacherAside(
  avatarX: number,
  avatarY: number,
  avatarSize: number,
  textX: number,
  content: AssetContent,
  nameStyle: ElementStyle,
  expStyle: ElementStyle,
): CanvasElement[] {
  const nameH = lineBoxHeight(nameStyle)
  const expH = lineBoxHeight(expStyle)
  const gap = 6
  const blockH = nameH + gap + expH
  const textY = avatarY + (avatarSize - blockH) / 2

  return [
    el({
      id: 'teacher-avatar',
      type: 'image',
      fieldKey: 'teacherAvatar',
      x: avatarX,
      y: avatarY,
      width: avatarSize,
      height: avatarSize,
      style: { borderRadius: avatarSize / 2, objectFit: 'cover' },
    }),
    el({
      id: 'teacher-name',
      type: 'text',
      fieldKey: 'teacherName',
      x: textX,
      y: textY,
      width: 300,
      height: nameH,
      content: content.teacherName,
      style: { ...nameStyle, verticalAlign: 'top' },
    }),
    el({
      id: 'teacher-exp',
      type: 'text',
      fieldKey: 'teacherExperience',
      x: textX,
      y: textY + nameH + gap,
      width: 400,
      height: expH,
      content: content.teacherExperience,
      style: { ...expStyle, verticalAlign: 'top' },
    }),
  ]
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
    ...teacherAside(
      40,
      730,
      80,
      140,
      content,
      { fontSize: 20, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 },
      { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.2 },
    ),
    el({ id: 'qr', type: 'image', fieldKey: 'qrCode', x: 580, y: 720, width: 130, height: 130, style: { borderRadius: 8, objectFit: 'cover', backgroundColor: '#ffffff' } }),
    el({ id: 'scan-text', type: 'text', x: 580, y: 860, width: 130, height: 24, content: labels.scanToEnroll, style: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }, locked: true }),
    ...ctaButton(
      'cta',
      40,
      900,
      200,
      44,
      content.cta,
      { backgroundColor: '#ffffff', borderRadius: 22 },
      { fontSize: 14, fontWeight: 600, color: '#4f46e5' },
    ),
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
    el({ id: 'courses-num', type: 'text', fieldKey: 'courseCount', x: 60, y: 520, width: 220, height: 68, content: String(content.courseCount), style: { fontSize: 32, fontWeight: 700, color: '#6366f1', textAlign: 'center', lineHeight: 1.2 } }),
    el({ id: 'courses-label', type: 'text', x: 60, y: 588, width: 220, height: 32, content: labels.courses, style: { fontSize: 13, color: textSecondary, textAlign: 'center' }, locked: true }),
    el({ id: 'students-num', type: 'text', fieldKey: 'studentCount', x: 320, y: 520, width: 220, height: 68, content: String(content.studentCount), style: { fontSize: 32, fontWeight: 700, color: '#6366f1', textAlign: 'center', lineHeight: 1.2 } }),
    el({ id: 'students-label', type: 'text', x: 320, y: 588, width: 220, height: 32, content: labels.students, style: { fontSize: 13, color: textSecondary, textAlign: 'center' }, locked: true }),
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
    el({ id: 'price', type: 'text', fieldKey: 'price', x: 50, y: 525, width: 220, height: 48, content: content.price, style: { fontSize: 28, fontWeight: 700, color: '#4f46e5', lineHeight: 1.2 } }),
    el({ id: 'schedule-box', type: 'shape', x: 310, y: 490, width: 260, height: 80, style: { backgroundColor: '#f8fafc', borderRadius: 12 } }),
    el({ id: 'schedule-label', type: 'text', x: 330, y: 505, width: 100, height: 18, content: labels.schedule, style: { fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: 1 }, locked: true }),
    el({ id: 'schedule', type: 'text', fieldKey: 'schedule', x: 330, y: 525, width: 220, height: 40, content: content.schedule, style: { fontSize: 16, fontWeight: 600, color: '#0f172a', lineHeight: 1.3 } }),
    ...teacherRow(
      'teacher',
      { x: 30, y: 610, width: 540, height: 80, style: { backgroundColor: '#f8fafc', borderRadius: 12 } },
      50,
      content,
      { fontSize: 16, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 },
      { fontSize: 13, color: '#64748b', lineHeight: 1.2 },
      300,
    ),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 500, y: 625, width: 50, height: 50, style: { borderRadius: 8, objectFit: 'cover' } }),
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
    el({ id: 'main-visual', type: 'image', fieldKey: 'classroomScreenshot', x: 48, y: 48, width: 984, height: 860, style: { borderRadius: 24, objectFit: 'cover' } }),
    ...centeredLabel(
      'badge',
      72,
      72,
      128,
      40,
      labels.hotBadge,
      { backgroundColor: '#ef4444', borderRadius: 20 },
      { fontSize: 15, fontWeight: 700, color: '#ffffff' },
      true,
    ),
    el({ id: 'headline', type: 'text', fieldKey: 'headline', x: 48, y: 940, width: 984, height: 110, content: content.headline, style: { fontSize: 46, fontWeight: 800, color: '#0f172a', lineHeight: 1.25 } }),
    el({ id: 'course-name', type: 'text', fieldKey: 'courseName', x: 48, y: 1060, width: 984, height: 44, content: content.courseName, style: { fontSize: 26, fontWeight: 600, color: '#6366f1', lineHeight: 1.3 } }),
    ...teacherTag(
      'teacher',
      48,
      1128,
      300,
      52,
      40,
      content,
      { backgroundColor: '#f1f5f9', borderRadius: 26 },
      { fontSize: 16, fontWeight: 600, color: '#334155', lineHeight: 1.2 },
    ),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 984, y: 1130, width: 48, height: 48, style: { borderRadius: 8, objectFit: 'cover' } }),
    ...ctaButton(
      'cta',
      48,
      1340,
      984,
      72,
      content.cta,
      { backgroundColor: '#6366f1', borderRadius: 16 },
      { fontSize: 26, fontWeight: 700, color: '#ffffff' },
    ),
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
  const { names } = getContext(locale)
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
    el({ id: 'visual', type: 'image', fieldKey: 'classroomScreenshot', x: 640, y: 40, width: 520, height: 548, style: { borderRadius: 16, objectFit: 'cover' } }),
    el({ id: 'logo', type: 'image', fieldKey: 'institutionLogo', x: 48, y: 44, width: 48, height: 48, style: { borderRadius: 8, objectFit: 'cover' } }),
    el({ id: 'inst-name', type: 'text', fieldKey: 'institutionName', x: 108, y: 52, width: 480, height: 32, content: content.institutionName, style: { fontSize: 18, fontWeight: 600, color: textColor, lineHeight: 1.3 } }),
    el({ id: 'headline', type: 'text', fieldKey: 'headline', x: 48, y: 112, width: 560, height: 96, content: content.headline, style: { fontSize: 34, fontWeight: 700, color: textColor, lineHeight: 1.25 } }),
    el({ id: 'course-name', type: 'text', fieldKey: 'courseName', x: 48, y: 218, width: 560, height: 36, content: content.courseName, style: { fontSize: 19, fontWeight: 500, color: subColor, lineHeight: 1.3 } }),
    ...teacherRow(
      'teacher',
      {
        x: 48,
        y: 278,
        width: 340,
        height: 60,
        style: { backgroundColor: isClean ? '#f1f5f9' : 'rgba(255,255,255,0.12)', borderRadius: 30 },
      },
      48,
      content,
      { fontSize: 16, fontWeight: 600, color: textColor, lineHeight: 1.2 },
      { fontSize: 12, color: subColor, lineHeight: 1.2 },
      260,
    ),
    el({ id: 'price', type: 'text', fieldKey: 'price', x: 48, y: 368, width: 220, height: 48, content: content.price, style: { fontSize: 30, fontWeight: 700, color: isClean ? '#6366f1' : '#a5b4fc', lineHeight: 1.2 } }),
    el({ id: 'schedule', type: 'text', fieldKey: 'schedule', x: 48, y: 420, width: 480, height: 28, content: content.schedule, style: { fontSize: 14, color: subColor, lineHeight: 1.3 } }),
    ...ctaButton(
      'cta',
      48,
      480,
      200,
      48,
      content.cta,
      { backgroundColor: isClean ? '#6366f1' : '#ffffff', borderRadius: 24 },
      { fontSize: 15, fontWeight: 600, color: isClean ? '#ffffff' : '#4f46e5' },
    ),
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
