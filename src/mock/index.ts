export { teachers } from './teachers'
export { courses } from './courses'
export { institutions } from './institutions'
export { screenshots } from './screenshots'

import { teachers } from './teachers'
import { courses } from './courses'
import { institutions } from './institutions'
import { screenshots } from './screenshots'
import type { AssetContent } from '../types'
import type { Locale } from '../i18n/types'
import { translate, getCategoryLabel } from '../i18n'

function buildContent(
  teacherId: string,
  courseId: string,
  institutionId: string,
  screenshotId: string,
  locale: Locale,
): AssetContent {
  const teacher = teachers.find((t) => t.id === teacherId) ?? teachers[0]
  const course = courses.find((c) => c.id === courseId) ?? courses[0]
  const institution = institutions.find((i) => i.id === institutionId) ?? institutions[0]
  const screenshot = screenshots.find((s) => s.id === screenshotId) ?? screenshots[0]
  const category = getCategoryLabel(locale, course.category)

  return {
    courseName: course.name,
    teacherName: teacher.name,
    teacherAvatar: teacher.avatar,
    teacherExperience: teacher.experience,
    teachingStyle: teacher.teachingStyle,
    courseCount: teacher.courseCount,
    studentCount: teacher.studentCount,
    classroomScreenshot: screenshot.url,
    institutionLogo: institution.logo,
    institutionName: institution.name,
    slogan: institution.slogan,
    qrCode: institution.qrCode,
    courseCover: course.cover,
    courseIntroduction: course.introduction,
    price: `¥${course.price.toLocaleString()}`,
    schedule: course.schedule,
    headline: translate(locale, 'content.defaultHeadline', { category }),
    cta: translate(locale, 'content.defaultCta'),
  }
}

export function getDefaultContent(locale: Locale = 'en'): AssetContent {
  return buildContent('t1', 'c1', 'i1', 'ss1', locale)
}

export function getContentFromSelection(
  teacherId: string,
  courseId: string,
  institutionId: string,
  screenshotId: string,
  locale: Locale = 'en',
): AssetContent {
  return buildContent(teacherId, courseId, institutionId, screenshotId, locale)
}
