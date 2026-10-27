import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AuthCard } from '../components/AuthCard'
import { FormField } from '../components/FormField'
import { ApiError } from '../lib/api'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const update = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: event.target.value })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setSubmitting(true)

    try {
      await register(form)
      navigate('/')
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : { email: ['Une erreur est survenue.'] })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Créer un compte">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="name"
          label="Nom"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          error={errors.name?.[0]}
          required
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email?.[0]}
          required
        />
        <FormField
          id="password"
          label="Mot de passe (8 caractères minimum)"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
          error={errors.password?.[0]}
          required
        />
        <FormField
          id="password_confirmation"
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          value={form.password_confirmation}
          onChange={update('password_confirmation')}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthCard>
  )
}
