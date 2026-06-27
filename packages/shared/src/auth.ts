export const PASSWORD_MIN_LENGTH = 8

type PasswordSignIn = (
  provider: 'password',
  params: { email: string; password: string; flow: 'signIn' | 'signUp' },
) => Promise<unknown>

function assertPasswordLength(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  }
}

function shouldTrySignUp(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const message = error.message
  return (
    message.includes('InvalidAccountId') ||
    message.includes('Invalid credentials') ||
    message.includes('Could not retrieve account')
  )
}

export async function signInWithPassword(
  signIn: PasswordSignIn,
  creds: { email: string; password: string },
) {
  assertPasswordLength(creds.password)

  try {
    await signIn('password', { ...creds, flow: 'signIn' })
  } catch (cause) {
    if (!shouldTrySignUp(cause)) throw cause
    await signIn('password', { ...creds, flow: 'signUp' })
  }
}
