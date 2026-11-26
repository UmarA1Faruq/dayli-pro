import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { PAGE_META } from './config/navigation'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Tasks from './pages/Tasks'
import Habits from './pages/Habits'
import Calendar from './pages/Calendar'
import Stats from './pages/Stats'
import Settings from './pages/Settings'

function DocumentTitle() {
  const location = useLocation()
  useEffect(() => {
    const meta = PAGE_META[location.pathname]
    document.title = meta ? `${meta.title} · Dayli Pro` : 'Dayli Pro — Catat harimu, rapikan hidupmu.'
  }, [location.pathname])
  return null
}

function LoginRoute() {
  const { isAuthenticated } = useApp()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Login />
}

function ProtectedLayout() {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Layout />
}

function NotFoundRedirect() {
  const { isAuthenticated } = useApp()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

function AppRoutes() {
  return (
    <>
      <DocumentTitle />
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
