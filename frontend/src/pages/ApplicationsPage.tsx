import { useEffect, useState } from 'react'
import { ApplicationFormModal } from '../components/ApplicationFormModal'
import { StatusBadge } from '../components/StatusBadge'
import { applicationsApi } from '../lib/applications'
import { STATUSES } from '../lib/status'
import type { ApplicationStatus, JobApplication, Paginated } from '../types'

// État de la fenêtre : fermée, création, ou modification d'une candidature
type ModalState = { open: false } | { open: true; application: JobApplication | null }

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString('fr-FR') : '—'

export function ApplicationsPage() {
  const [filter, setFilter] = useState<ApplicationStatus | null>(null)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<Paginated<JobApplication> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [modal, setModal] = useState<ModalState>({ open: false })

  // Recharge la liste quand le filtre, la page ou reloadKey changent
  useEffect(() => {
    let cancelled = false

    applicationsApi
      .list(filter, page)
      .then((data) => {
        if (!cancelled) {
          setResult(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger les candidatures.')
      })

    return () => {
      cancelled = true
    }
  }, [filter, page, reloadKey])

  const reload = () => setReloadKey((key) => key + 1)

  const changeFilter = (status: ApplicationStatus | null) => {
    setFilter(status)
    setPage(1)
  }

  const changeStatus = async (application: JobApplication, status: ApplicationStatus) => {
    await applicationsApi.update(application.id, { status })
    reload()
  }

  const remove = async (application: JobApplication) => {
    if (!window.confirm(`Supprimer la candidature chez ${application.company} ?`)) return

    await applicationsApi.remove(application.id)
    reload()
  }

  const handleSaved = () => {
    setModal({ open: false })
    reload()
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes candidatures</h1>
          {result && <p className="text-sm text-slate-500">{result.meta.total} au total</p>}
        </div>
        <button
          onClick={() => setModal({ open: true, application: null })}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          + Nouvelle candidature
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ value: null, label: 'Toutes' }, ...STATUSES].map((item) => (
          <button
            key={item.label}
            onClick={() => changeFilter(item.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === item.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

      {!result && !error && <p className="text-slate-500">Chargement…</p>}

      {result && result.data.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <p className="text-slate-600">Aucune candidature pour le moment.</p>
        </div>
      )}

      {result && result.data.length > 0 && (
        <ul className="space-y-3">
          {result.data.map((application) => (
            <li
              key={application.id}
              className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{application.position}</h2>
                  <StatusBadge status={application.status} />
                  {application.needs_follow_up && (
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                      À relancer
                    </span>
                  )}
                </div>
                <p className="text-slate-600">
                  {application.company}
                  {application.location && ` · ${application.location}`}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Candidature du {formatDate(application.applied_at)}
                  {application.url && (
                    <>
                      {' · '}
                      <a
                        href={application.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Voir l'offre
                      </a>
                    </>
                  )}
                </p>
                {application.notes && (
                  <p className="mt-2 text-sm whitespace-pre-line text-slate-600">{application.notes}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`status-${application.id}`}>
                  Statut
                </label>
                <select
                  id={`status-${application.id}`}
                  value={application.status}
                  onChange={(event) => changeStatus(application, event.target.value as ApplicationStatus)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setModal({ open: true, application })}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                >
                  Modifier
                </button>
                <button
                  onClick={() => remove(application)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {result && result.meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-sm text-slate-600">
            Page {result.meta.current_page} / {result.meta.last_page}
          </span>
          <button
            disabled={page >= result.meta.last_page}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>
      )}

      {modal.open && (
        <ApplicationFormModal
          application={modal.application}
          onClose={() => setModal({ open: false })}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
