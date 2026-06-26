export function getDevAuthCredentials(): { email: string; password: string } | null {
  const email = (import.meta.env.VITE_DEV_AUTH_EMAIL as string | undefined)?.trim()
  if (!email) return null

  const password = (import.meta.env.VITE_DEV_AUTH_PASSWORD as string | undefined)?.trim() || 'devpassword123'
  return { email, password }
}

type PasswordSignIn = (
  provider: 'password',
  params: { email: string; password: string; flow: 'signIn' | 'signUp' },
) => Promise<unknown>

export async function signInWithPassword(signIn: PasswordSignIn, creds: { email: string; password: string }) {
  try {
    await signIn('password', { ...creds, flow: 'signIn' })
  } catch {
    await signIn('password', { ...creds, flow: 'signUp' })
  }
}
