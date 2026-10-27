import { useEffect, useState, type ReactNode } from 'react'
import { api, tokenStorage } from '../lib/api'
import type { AuthResponse, User } from '../types'
import { AuthContext, type RegisterData } from './AuthContext'

/**
 * Garde en mémoire l'utilisateur connecté et le partage avec toute l'application.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // On ne charge que si un jeton existe déjà (utilisateur revenu sur le site)
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null)

  useEffect(() => {
    if (!tokenStorage.get()) return

    api<User>('/me')
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  const authenticate = (response: AuthResponse) => {
    tokenStorage.set(response.token)
    setUser(response.user)
  }

  const login = async (email: string, password: string) => {
    authenticate(
      await api<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    )
  }

  const register = async (data: RegisterData) => {
    authenticate(
      await api<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    )
  }

  const logout = async () => {
    try {
      await api('/logout', { method: 'POST' })
    } finally {
      tokenStorage.clear()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
