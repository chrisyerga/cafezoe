'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '#convex/_generated/api'

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
})

function DashboardPage() {
  const pets = useQuery(api.pets.listMine)
  const profile = useQuery(api.profiles.getMine)
  const { signOut } = useAuthActions()
  const firstName = profile?.profile?.displayName ?? profile?.user.name ?? profile?.user.email ?? 'friend'

  return (
    <section className="dashboard-grid">
      <div className="dashboard-hero">
        <p className="eyebrow">Studio desk</p>
        <h1>Welcome back, {firstName.split(/\s+/)[0]}.</h1>
        <p>
          Start by adding the pets that will anchor CafeZoe content. The generation preview already uses the
          shared core package, but no provider calls are made yet.
        </p>
        <div className="hero-actions">
          <Link to="/app/pets/new" className="button primary">
            Add a pet
          </Link>
          <button className="button ghost" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </div>
      <div className="dashboard-card">
        <span className="metric-number">{pets?.length ?? 0}</span>
        <span className="metric-label">pets in the roster</span>
        <Link to="/app/pets" className="text-link">
          Manage pets
        </Link>
      </div>
    </section>
  )
}
