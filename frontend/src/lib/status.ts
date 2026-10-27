import type { ApplicationStatus } from '../types'

/**
 * Libellé et couleur de chaque statut, dans l'ordre d'avancement d'une candidature.
 */
export const STATUSES: { value: ApplicationStatus; label: string; badge: string }[] = [
  { value: 'to_apply', label: 'À postuler', badge: 'bg-slate-100 text-slate-700' },
  { value: 'sent', label: 'Envoyée', badge: 'bg-blue-100 text-blue-700' },
  { value: 'interview', label: 'Entretien', badge: 'bg-amber-100 text-amber-800' },
  { value: 'offer', label: 'Offre', badge: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Refus', badge: 'bg-red-100 text-red-700' },
]

export function statusInfo(status: ApplicationStatus) {
  return STATUSES.find((item) => item.value === status) ?? STATUSES[0]
}
