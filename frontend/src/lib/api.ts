import i18n from '../i18n'

const TOKEN_KEY = 'canditrack_token'

/**
 * Stockage du jeton d'accès dans le navigateur.
 */
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

/**
 * Erreur renvoyée par l'API, avec les erreurs de validation de Laravel (champ → messages).
 */
export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

/**
 * Appelle l'API Laravel : ajoute le jeton, envoie et lit du JSON, et transforme les erreurs.
 */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  headers.set('Accept-Language', i18n.language)

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = tokenStorage.get()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`/api${path}`, { ...options, headers })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message ?? i18n.t('errors.generic'),
      data.errors ?? {},
    )
  }

  return data as T
}
