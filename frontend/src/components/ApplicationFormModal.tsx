import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { applicationsApi } from '../lib/applications'
import { ApiError } from '../lib/api'
import { STATUSES } from '../lib/status'
import type { JobApplication, JobApplicationInput } from '../types'
import { FormField } from './FormField'

type Props = {
  application: JobApplication | null // null = création, sinon modification
  onClose: () => void
  onSaved: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Fenêtre de création ou de modification d'une candidature.
 */
export function ApplicationFormModal({ application, onClose, onSaved }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState<JobApplicationInput>({
    company: application?.company ?? '',
    position: application?.position ?? '',
    location: application?.location ?? '',
    url: application?.url ?? '',
    status: application?.status ?? 'sent',
    applied_at: application?.applied_at ?? today(),
    notes: application?.notes ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const update =
    (field: keyof JobApplicationInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: event.target.value })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setSubmitting(true)

    try {
      if (application) {
        await applicationsApi.update(application.id, form)
      } else {
        await applicationsApi.create(form)
      }
      onSaved()
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : { company: [t('errors.generic')] })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="form-title" className="mb-4 text-xl font-bold">
          {application ? t('applications.form.editTitle') : t('applications.form.createTitle')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            id="company"
            label={t('applications.form.company')}
            value={form.company}
            onChange={update('company')}
            error={errors.company?.[0]}
          />
          <FormField
            id="position"
            label={t('applications.form.position')}
            value={form.position}
            onChange={update('position')}
            error={errors.position?.[0]}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="location"
              label={t('applications.form.location')}
              value={form.location}
              onChange={update('location')}
              error={errors.location?.[0]}
            />
            <FormField
              id="applied_at"
              label={t('applications.form.appliedAt')}
              type="date"
              value={form.applied_at}
              onChange={update('applied_at')}
              error={errors.applied_at?.[0]}
            />
          </div>

          <FormField
            id="url"
            label={t('applications.form.url')}
            type="url"
            placeholder="https://"
            value={form.url}
            onChange={update('url')}
            error={errors.url?.[0]}
          />

          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">
              {t('applications.form.status')}
            </label>
            <select
              id="status"
              value={form.status}
              onChange={update('status')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {t(`status.${status.value}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              {t('applications.form.notes')}
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={update('notes')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
