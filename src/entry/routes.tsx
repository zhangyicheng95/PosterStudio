import type { RouteObject } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { UploadPage } from '../pages/UploadPage'
import { WorkspacePage } from '../pages/WorkspacePage'

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/workspace', element: <WorkspacePage /> },
]
