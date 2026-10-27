import type { ApplicationStatus } from '../types'

/**
 * Les statuts dans l'ordre d'avancement, avec leur couleur.
 * Les libellés sont traduits avec t(`status.${value}`).
 */
export const STATUSES: { value: ApplicationStatus; badge: string }[] = [
  { value: 'to_apply', badge: 'bg-slate-100 text-slate-700' },
  { value: 'sent', badge: 'bg-blue-100 text-blue-700' },
  { value: 'interview', badge: 'bg-amber-100 text-amber-800' },
  { value: 'offer', badge: 'bg-green-100 text-green-700' },
  { value: 'rejected', badge: 'bg-red-100 text-red-700' },
]

export function statusBadge(status: ApplicationStatus) {
  return (STATUSES.find((item) => item.value === status) ?? STATUSES[0]).badge
}
