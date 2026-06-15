import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { PageLoader } from '../components/ui/PageLoader'
import { RequireGenerated } from './RequireGenerated'

const UploadPage = lazy(() => import('../pages/UploadPage').then((m) => ({ default: m.UploadPage })))
const WorkspacePage = lazy(() => import('../pages/WorkspacePage').then((m) => ({ default: m.WorkspacePage })))

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  {
    path: '/upload',
    element: (
      <LazyPage>
        <UploadPage />
      </LazyPage>
    ),
  },
  {
    path: '/workspace',
    element: (
      <LazyPage>
        <RequireGenerated>
          <WorkspacePage />
        </RequireGenerated>
      </LazyPage>
    ),
  },
]
