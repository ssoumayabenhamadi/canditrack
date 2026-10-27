import { statusInfo } from '../lib/status'
import type { ApplicationStatus } from '../types'

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, badge } = statusInfo(status)

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>{label}</span>
}
