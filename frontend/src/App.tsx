import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { Layout } from './components/Layout'
import { GuestRoute, ProtectedRoute } from './components/RouteGuards'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<ApplicationsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
