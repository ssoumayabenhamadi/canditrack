import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { LanguageSwitcher } from './LanguageSwitcher'

/**
 * Mise en page des pages connectées : barre du haut + contenu de la page.
 */
export function Layout() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold text-indigo-600">CandiTrack</span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="hidden text-sm text-slate-600 sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
