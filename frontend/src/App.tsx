import { Routes, Route, Navigate, useEffect } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { motion } from 'framer-motion'
import './App.css'

// Pages
import AuthPage from './pages/AuthPage'
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

// Components
import Navbar from './components/layout/Navbar'

function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    if (auth?.user?.id && auth.refresh) {
      auth.refresh().catch(() => {})
    }
  }, [auth])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default function App() {
  const auth = useAuth()
  const isFreelancer = auth?.user && auth.isFreelancer()
  const isClient = auth?.user && auth.isClient()

  // Determine default route based on role
  const defaultRoute = isClient ? '/client/dashboard' : '/clients'

  return (
    <Routes>
      <Route path="/" element={<Navigate to={auth?.user ? defaultRoute : '/login'} replace />} />
      <Route
        path="/login"
        element={
          auth?.user ? (
            <Navigate to={defaultRoute} replace />
          ) : (
            <AuthPage />
          )
        }
      />

      {/* Freelancer Routes */}
      <Route
        path="/clients"
        element={
          isFreelancer ? (
            <AppLayout>
              <ClientsPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/projects"
        element={
          isFreelancer ? (
            <AppLayout>
              <ProjectsPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/tasks"
        element={
          isFreelancer ? (
            <AppLayout>
              <TasksPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/timer"
        element={
          isFreelancer ? (
            <AppLayout>
              <TimerPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/invoices"
        element={
          isFreelancer ? (
            <AppLayout>
              <InvoicesPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/reports"
        element={
          isFreelancer ? (
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/calendar"
        element={
          isFreelancer ? (
            <AppLayout>
              <CalendarPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Client Portal Routes */}
      <Route
        path="/client/dashboard"
        element={
          isClient ? (
            <AppLayout>
              <ClientDashboardPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/client/projects"
        element={
          isClient ? (
            <AppLayout>
              <ClientProjectsPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/client/projects/:id"
        element={
          isClient ? (
            <AppLayout>
              <ClientProjectDetailPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/client/messages"
        element={
          isClient ? (
            <AppLayout>
              <ClientMessagesPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/client/invoices"
        element={
          isClient ? (
            <AppLayout>
              <ClientInvoicesPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/client/time-report"
        element={
          isClient ? (
            <AppLayout>
              <ClientTimeReportPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}
