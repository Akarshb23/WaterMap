import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

/**
 * App shell layout: fixed sidebar on the left, top bar across the main
 * content area, and the routed page below it. The sidebar collapses into a
 * drawer on small screens; `isSidebarOpen` is shared with the top-bar menu
 * button and closed with the backdrop, a nav click or the Escape key.
 */
const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen])

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-layout__main">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
