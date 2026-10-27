import type { ReactNode } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'

/**
 * Carte centrée utilisée par les pages de connexion et d'inscription.
 */
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-indigo-600">CandiTrack</p>
          <LanguageSwitcher />
        </div>
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </main>
  )
}
