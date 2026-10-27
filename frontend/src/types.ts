export type User = {
  id: number
  name: string
  email: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type ApplicationStatus = 'to_apply' | 'sent' | 'interview' | 'offer' | 'rejected'

export type JobApplication = {
  id: number
  company: string
  position: string
  location: string | null
  url: string | null
  status: ApplicationStatus
  applied_at: string | null
  notes: string | null
  needs_follow_up: boolean
  created_at: string
  updated_at: string
}

/**
 * Données envoyées à l'API pour créer ou modifier une candidature.
 */
export type JobApplicationInput = {
  company: string
  position: string
  location: string
  url: string
  status: ApplicationStatus
  applied_at: string
  notes: string
}

/**
 * Format d'une liste paginée renvoyée par Laravel.
 */
export type Paginated<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}
