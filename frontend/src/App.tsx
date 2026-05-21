import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './AuthContext'
import AuthPage from './pages/AuthPage'
import MainLayout from './layouts/MainLayout'
import RequireAuth from './layouts/RequireAuth'
import LandingPage from './pages/LandingPage'
import ClientsPage from './pages/ClientsPage'
import ProjectsPage from './pages/ProjectsPage'
import TasksPage from './pages/TasksPage'
import TimerPage from './pages/TimerPage'
import InvoicesPage from './pages/InvoicesPage'
import ReportsPage from './pages/ReportsPage'
import CalendarPage from './pages/CalendarPage'
import ClientDashboardPage from './pages/ClientDashboardPage'
import ClientProjectsPage from './pages/ClientProjectsPage'
import ClientProjectDetailPage from './pages/ClientProjectDetailPage'
import ClientInvoicesPage from './pages/ClientInvoicesPage'
import ClientTimeReportPage from './pages/ClientTimeReportPage'
import ClientMessagesPage from './pages/ClientMessagesPage'

export default function App() {
  const auth = useAuth()
  const isFreelancer = auth?.user && auth.isFreelancer()
  const isClient = auth?.user && auth.isClient()

  const defaultRoute = isClient ? '/client/dashboard' : '/clients'

  useEffect(() => {
    if (auth?.user?.id && auth.refresh) {
      auth.refresh().catch(() => {})
    }
  }, [auth])

  return (
    <Routes>
      <Route path="/" element={auth?.user ? <Navigate to={defaultRoute} replace /> : <LandingPage />} />
      <Route path="/login" element={auth?.user ? <Navigate to={defaultRoute} replace /> : <AuthPage />} />

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/clients" element={isFreelancer ? <ClientsPage /> : <Navigate to="/login" replace />} />
        <Route path="/projects" element={isFreelancer ? <ProjectsPage /> : <Navigate to="/login" replace />} />
        <Route path="/tasks" element={isFreelancer ? <TasksPage /> : <Navigate to="/login" replace />} />
        <Route path="/timer" element={isFreelancer ? <TimerPage /> : <Navigate to="/login" replace />} />
        <Route path="/invoices" element={isFreelancer ? <InvoicesPage /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={isFreelancer ? <ReportsPage /> : <Navigate to="/login" replace />} />
        <Route path="/calendar" element={isFreelancer ? <CalendarPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/dashboard" element={isClient ? <ClientDashboardPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/projects" element={isClient ? <ClientProjectsPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/projects/:id" element={isClient ? <ClientProjectDetailPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/messages" element={isClient ? <ClientMessagesPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/invoices" element={isClient ? <ClientInvoicesPage /> : <Navigate to="/login" replace />} />
        <Route path="/client/time-report" element={isClient ? <ClientTimeReportPage /> : <Navigate to="/login" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}