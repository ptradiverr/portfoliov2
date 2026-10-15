import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ProjectPage from './ProjectPage.tsx'

const projectRoute = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
const rootElement = document.getElementById('root')!

if (!projectRoute) {
  try {
    // Decide before rendering to avoid a flash of hidden content on return visits.
    const key = 'portfolio:home-visited'
    if (sessionStorage.getItem(key) === 'true') {
      rootElement.classList.add('skip-home-intro')
    }
    sessionStorage.setItem(key, 'true')
  } catch {
    // Keep the normal entrance animations when browser storage is unavailable.
  }
}

createRoot(rootElement).render(
  <StrictMode>
    {projectRoute ? <ProjectPage slug={projectRoute[1]} /> : <App />}
  </StrictMode>,
)
