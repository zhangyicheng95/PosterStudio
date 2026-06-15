export type AssetType =
  | 'enrollment-poster'
  | 'teacher-card'
  | 'course-card'
  | 'xiaohongshu-cover'
  | 'moments-banner'

export interface ElementStyle {
  fontSize?: number
  fontWeight?: number | string
  color?: string
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  borderRadius?: number
  opacity?: number
  fontFamily?: string
  lineHeight?: number
  letterSpacing?: number
  objectFit?: 'cover' | 'contain' | 'fill'
  /** Vertical alignment inside the element box. Defaults to middle when textAlign is center, else top. */
  verticalAlign?: 'top' | 'middle'
}

export interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'qrcode'
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  content?: string
  src?: string
  style?: ElementStyle
  fieldKey?: string
  locked?: boolean
}

export interface Template {
  id: string
  name: string
  assetType: AssetType
  width: number
  height: number
  background: string
  elements: CanvasElement[]
}

export interface Teacher {
  id: string
  name: string
  avatar: string
  experience: string
  teachingStyle: string
  courseCount: number
  studentCount: number
  specialty: string
}

export interface Course {
  id: string
  name: string
  cover: string
  introduction: string
  price: number
  schedule: string
  teacherId: string
  category: string
}

export interface Institution {
  id: string
  name: string
  logo: string
  slogan: string
  qrCode: string
}

export interface ClassroomScreenshot {
  id: string
  url: string
  title: string
  courseId: string
}

export interface AssetContent {
  courseName: string
  teacherName: string
  teacherAvatar: string
  teacherExperience: string
  teachingStyle: string
  courseCount: number
  studentCount: number
  classroomScreenshot: string
  institutionLogo: string
  institutionName: string
  slogan: string
  qrCode: string
  courseCover: string
  courseIntroduction: string
  price: string
  schedule: string
  headline: string
  cta: string
}

export interface GeneratedAsset {
  id: string
  assetType: AssetType
  templateId: string
  name: string
  elements: CanvasElement[]
  background: string
  width: number
  height: number
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  'enrollment-poster': 'Enrollment Poster',
  'teacher-card': 'Teacher Card',
  'course-card': 'Course Card',
  'xiaohongshu-cover': 'Xiaohongshu Cover',
  'moments-banner': 'Moments Banner',
}

export const ASSET_TYPE_DIMENSIONS: Record<AssetType, { width: number; height: number }> = {
  'enrollment-poster': { width: 750, height: 1334 },
  'teacher-card': { width: 600, height: 800 },
  'course-card': { width: 600, height: 750 },
  'xiaohongshu-cover': { width: 1080, height: 1440 },
  'moments-banner': { width: 1200, height: 628 },
}
