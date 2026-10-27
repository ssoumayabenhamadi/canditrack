import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApplicationFormModal } from '../components/ApplicationFormModal'
import { StatusBadge } from '../components/StatusBadge'
import { applicationsApi } from '../lib/applications'
import { STATUSES } from '../lib/status'
import type { ApplicationStatus, JobApplication, Paginated } from '../types'

// État de la fenêtre : fermée, création, ou modification d'une candidature
type ModalState = { open: false } | { open: true; application: JobApplication | null }

export function ApplicationsPage() {
  const { t, i18n } = useTranslation()
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
        if (!cancelled) setError(t('errors.loadApplications'))
      })

    return () => {
      cancelled = true
    }
  }, [filter, page, reloadKey, t])

  // Date affichée au format de la langue choisie (23/10/2026 ou 23 Oct 2026)
  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString(i18n.language === 'en' ? 'en-GB' : 'fr-FR', {
          dateStyle: 'medium',
        })
      : '—'

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
    if (!window.confirm(t('applications.confirmDelete', { company: application.company }))) return

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
          <h1 className="text-2xl font-bold">{t('applications.title')}</h1>
          {result && <p className="text-sm text-slate-500">{t('applications.total', { count: result.meta.total })}</p>}
        </div>
        <button
          onClick={() => setModal({ open: true, application: null })}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          {t('applications.new')}
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[null, ...STATUSES.map((status) => status.value)].map((value) => (
          <button
            key={value ?? 'all'}
            onClick={() => changeFilter(value)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {value ? t(`status.${value}`) : t('applications.all')}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

      {!result && !error && <p className="text-slate-500">{t('common.loading')}</p>}

      {result && result.data.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <p className="text-slate-600">{t('applications.empty')}</p>
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
                      {t('applications.followUp')}
                    </span>
                  )}
                </div>
                <p className="text-slate-600">
                  {application.company}
                  {application.location && ` · ${application.location}`}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {t('applications.appliedOn', { date: formatDate(application.applied_at) })}
                  {application.url && (
                    <>
                      {' · '}
                      <a
                        href={application.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {t('applications.viewOffer')}
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
                  {t('applications.form.status')}
                </label>
                <select
                  id={`status-${application.id}`}
                  value={application.status}
                  onChange={(event) => changeStatus(application, event.target.value as ApplicationStatus)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {t(`status.${status.value}`)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setModal({ open: true, application })}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => remove(application)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  {t('common.delete')}
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
            {t('applications.previous')}
          </button>
          <span className="text-sm text-slate-600">
            {t('applications.page', { current: result.meta.current_page, last: result.meta.last_page })}
          </span>
          <button
            disabled={page >= result.meta.last_page}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            {t('applications.next')}
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
