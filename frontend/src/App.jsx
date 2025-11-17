import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import './App.css'
import ClientsPage from './pages/ClientsPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import TimerPage from './pages/TimerPage.jsx'
import InvoicesPage from './pages/InvoicesPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import ClientDashboardPage from './pages/ClientDashboardPage.jsx'
import ClientProjectsPage from './pages/ClientProjectsPage.jsx'
import ClientProjectDetailPage from './pages/ClientProjectDetailPage.jsx'
import ClientInvoicesPage from './pages/ClientInvoicesPage.jsx'
import ClientTimeReportPage from './pages/ClientTimeReportPage.jsx'

function AppLayout({ children }) {
  const auth = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    auth.logout()
    navigate('/login')
  }

  const isFreelancer = auth.isFreelancer()
  const isClient = auth.isClient()

  return (
    <div className="app-shell">
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {isFreelancer && (
          <>
            <NavLink to="/clients" className={({ isActive }) => isActive ? 'active' : undefined}>Clients</NavLink>
            <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : undefined}>Projects</NavLink>
            <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : undefined}>Tasks</NavLink>
            <NavLink to="/timer" className={({ isActive }) => isActive ? 'active' : undefined}>Timer</NavLink>
            <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : undefined}>Invoices</NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : undefined}>Reports</NavLink>
            <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : undefined}>Calendar</NavLink>
          </>
        )}
        {isClient && (
          <>
            <NavLink to="/client/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>Dashboard</NavLink>
            <NavLink to="/client/projects" className={({ isActive }) => isActive ? 'active' : undefined}>Projects</NavLink>
            <NavLink to="/client/invoices" className={({ isActive }) => isActive ? 'active' : undefined}>Invoices</NavLink>
            <NavLink to="/client/time-report" className={({ isActive }) => isActive ? 'active' : undefined}>Time Report</NavLink>
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {auth?.user ? (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div title={auth.user.email} style={{ width: 28, height: 28, borderRadius: '50%', background: '#1f2937', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>
                  {(auth.user.name || auth.user.email).slice(0,1).toUpperCase()}
                </div>
                <span>{auth.user.name || auth.user.email}</span>
                {auth.user.role && (
                  <span style={{ 
                    fontSize: 12, 
                    padding: '2px 8px', 
                    background: isFreelancer ? '#e3f2fd' : '#f3e5f5',
                    color: isFreelancer ? '#1565c0' : '#6a1b9a',
                    borderRadius: 4 
                  }}>
                    {auth.user.role}
                  </span>
                )}
                <button className="secondary" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
      {children}
    </div>
  )
}

function Placeholder({ title }) {
  return <div>{title}</div>
}

export default function App() {
  const auth = useAuth()
  const isFreelancer = auth?.user && auth.isFreelancer()
  const isClient = auth?.user && auth.isClient()
  
  // Determine default route based on role
  const defaultRoute = isClient ? '/client/dashboard' : '/clients'
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to={auth?.user ? defaultRoute : '/login'} replace />} />
        <Route path="/login" element={auth?.user ? <Navigate to={defaultRoute} replace /> : <AuthPage />} />
        
        {/* Freelancer Routes */}
        <Route path="/clients" element={isFreelancer ? <ClientsPage /> : <Navigate to="/login" replace />} />
        <Route path="/projects" element={isFreelancer ? <ProjectsPage /> : <Navigate to="/login" replace />} />
        <Route path="/tasks" element={isFreelancer ? <TasksPage /> : <Navigate to="/login" replace />} />
        <Route path="/timer" element={isFreelancer ? <TimerPage /> : <Navigate to="/login" replace />} />
        <Route path="/invoices" element={isFreelancer ? <InvoicesPage /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={isFreelancer ? <ReportsPage /> : <Navigate to="/login" replace />} />
        <Route path="/calendar" element={isFreelancer ? <CalendarPage /> : <Navigate to="/login" replace />} />
        
        {/* Client Portal Routes */}
        <Route path="/client/dashboard" element={isClient ? <ClientDashboardPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/projects" element={isClient ? <ClientProjectsPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/projects/:id" element={isClient ? <ClientProjectDetailPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/invoices" element={isClient ? <ClientInvoicesPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/time-report" element={isClient ? <ClientTimeReportPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </AppLayout>
  )
}
