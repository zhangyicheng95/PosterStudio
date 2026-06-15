import { BrowserRouter, useRoutes } from 'react-router-dom'
import { LocaleSync } from './LocaleSync'
import { routes } from './routes'

function AppRoutes() {
  return useRoutes(routes)
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleSync />
      <AppRoutes />
    </BrowserRouter>
  )
}
