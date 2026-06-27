export function getDevAuthCredentials(): { email: string; password: string } | null {
  const email = (import.meta.env.VITE_DEV_AUTH_EMAIL as string | undefined)?.trim()
  if (!email) return null

  const password = (import.meta.env.VITE_DEV_AUTH_PASSWORD as string | undefined)?.trim() || 'devpassword123'
  return { email, password }
}

export { signInWithPassword } from '@lindale/shared'
