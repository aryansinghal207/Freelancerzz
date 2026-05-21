import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-dark-bg text-dark-text">
      {/* Sidebar */}
      <Sidebar className={`${!isSidebarCollapsed ? '' : 'hidden'} lg:block`} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar 
          title="Freelancerzz" 
          isSidebarCollapsed={isSidebarCollapsed} 
          setIsSidebarCollapsed={setIsSidebarCollapsed} 
        />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout