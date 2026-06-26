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
