import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AuthCard } from '../components/AuthCard'
import { FormField } from '../components/FormField'
import { ApiError } from '../lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setSubmitting(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : { email: [t('errors.generic')] })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title={t('auth.login.title')}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="email"
          label={t('auth.fields.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email?.[0]}
          required
        />
        <FormField
          id="password"
          label={t('auth.fields.password')}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password?.[0]}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
          {t('auth.login.register')}
        </Link>
      </p>
    </AuthCard>
  )
}
