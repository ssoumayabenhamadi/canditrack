import type { ApplicationStatus, JobApplication, JobApplicationInput, Paginated } from '../types'
import { api } from './api'

/**
 * Appels à l'API des candidatures.
 */
export const applicationsApi = {
  list: (status: ApplicationStatus | null, page: number) => {
    const params = new URLSearchParams({ page: String(page) })
    if (status) params.set('status', status)

    return api<Paginated<JobApplication>>(`/applications?${params}`)
  },

  create: (input: JobApplicationInput) =>
    api<{ data: JobApplication }>('/applications', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  update: (id: number, input: Partial<JobApplicationInput>) =>
    api<{ data: JobApplication }>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  remove: (id: number) => api<void>(`/applications/${id}`, { method: 'DELETE' }),
}
