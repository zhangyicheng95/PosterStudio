import type { ClassroomScreenshot } from '../types'
import { courses } from './courses'

const classroomThemes = [
  'Interactive Whiteboard Session',
  'Group Discussion Activity',
  'Live Coding Demo',
  'Math Problem Solving',
  'Reading Circle Time',
  'Science Experiment Lab',
  'Language Role Play',
  'Art Studio Workshop',
  'Music & Movement Class',
  'Robotics Assembly',
]

export const screenshots: ClassroomScreenshot[] = Array.from({ length: 30 }, (_, i) => {
  const course = courses[i % courses.length]
  return {
    id: `ss${i + 1}`,
    url: `https://picsum.photos/seed/classroom${i + 1}/800/600`,
    title: classroomThemes[i % classroomThemes.length],
    courseId: course.id,
  }
})
