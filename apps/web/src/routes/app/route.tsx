'use client'

import { useConvexAuth } from '@convex-dev/auth/react'
import { Navigate, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (isLoading) {
    return <main className="page-panel muted">Checking your cafe key...</main>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: pathname }} />
  }

  return (
    <main className="app-shell">
      <Outlet />
    </main>
  )
}
