import { useTranslation } from 'react-i18next'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth'

/**
 * Pages réservées aux utilisateurs connectés : sinon, redirection vers /login.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  if (loading) {
    return <p className="p-8 text-center text-slate-500">{t('common.loading')}</p>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * Pages réservées aux visiteurs (connexion, inscription) : si déjà connecté, retour à l'accueil.
 */
export function GuestRoute() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  if (loading) {
    return <p className="p-8 text-center text-slate-500">{t('common.loading')}</p>
  }

  return user ? <Navigate to="/" replace /> : <Outlet />
}
