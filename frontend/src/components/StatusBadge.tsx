import { useTranslation } from 'react-i18next'
import { statusBadge } from '../lib/status'
import type { ApplicationStatus } from '../types'

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useTranslation()

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(status)}`}>
      {t(`status.${status}`)}
    </span>
  )
}
