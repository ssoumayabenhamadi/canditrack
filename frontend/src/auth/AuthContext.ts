import { createContext } from 'react'
import type { User } from '../types'

export type RegisterData = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
