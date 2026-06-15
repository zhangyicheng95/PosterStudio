export type Locale = 'en' | 'zh'

export interface TemplateLabels {
  scanToEnroll: string
  teachingStyle: string
  courses: string
  students: string
  aboutCourse: string
  tuition: string
  schedule: string
  hotBadge: string
  learnMore: string
}

export interface TemplateVariantNames {
  enrollmentPoster: { classic: string; warm: string; fresh: string }
  teacherCard: { modern: string; dark: string; accent: string }
  courseCard: { standard: string; compact: string }
  xiaohongshu: { bold: string; minimal: string; vibrant: string }
  moments: { professional: string; bright: string; clean: string }
}

export type TranslationDict = typeof import('./locales/en').default
