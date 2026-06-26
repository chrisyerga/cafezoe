'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getDevAuthCredentials, signInWithPassword } from '../lib/localAuth'

export const Route = createFileRoute('/login')({
  validateSearch: (raw: Record<string, unknown>) => ({
    redirect: typeof raw.redirect === 'string' ? raw.redirect : undefined,
  }),
  component: LoginPage,
})

function LoginPage() {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const preset = getDevAuthCredentials()
  const [email, setEmail] = useState(preset?.email ?? '')
  const [password, setPassword] = useState(preset?.password ?? '')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signInWithPassword(signIn, { email: email.trim(), password })
      await navigate({ to: redirect ?? '/app' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-panel">
      <section className="auth-card">
        <p className="eyebrow">Cafe key</p>
        <h1>Sign in or create a local account.</h1>
        <p>
          Password auth is the starter path for this scaffold. OAuth can join the same Convex Auth surface once
          provider credentials are ready.
        </p>
        <form className="stack-form" onSubmit={(event) => void handleSubmit(event)}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={8}
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button primary" disabled={busy} type="submit">
            {busy ? 'Opening...' : 'Continue'}
          </button>
        </form>
      </section>
    </main>
  )
}
