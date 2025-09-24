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

function AppLayout({ children }) {
  const auth = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    auth.logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <NavLink to="/clients" className={({ isActive }) => isActive ? 'active' : undefined}>Clients</NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : undefined}>Projects</NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : undefined}>Tasks</NavLink>
        <NavLink to="/timer" className={({ isActive }) => isActive ? 'active' : undefined}>Timer</NavLink>
        <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : undefined}>Invoices</NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : undefined}>Reports</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : undefined}>Calendar</NavLink>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {auth?.user ? (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div title={auth.user.email} style={{ width: 28, height: 28, borderRadius: '50%', background: '#1f2937', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>
                  {(auth.user.name || auth.user.email).slice(0,1).toUpperCase()}
                </div>
                <span>{auth.user.name || auth.user.email}</span>
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
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to={auth?.user ? '/clients' : '/login'} replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/clients" element={auth?.user ? <ClientsPage /> : <Navigate to="/login" replace />} />
        <Route path="/projects" element={auth?.user ? <ProjectsPage /> : <Navigate to="/login" replace />} />
        <Route path="/tasks" element={auth?.user ? <TasksPage /> : <Navigate to="/login" replace />} />
        <Route path="/timer" element={auth?.user ? <TimerPage /> : <Navigate to="/login" replace />} />
        <Route path="/invoices" element={auth?.user ? <InvoicesPage /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={auth?.user ? <ReportsPage /> : <Navigate to="/login" replace />} />
        <Route path="/calendar" element={auth?.user ? <CalendarPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </AppLayout>
  )
}
