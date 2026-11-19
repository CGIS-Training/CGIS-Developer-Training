import { config } from '../config'
import { useAuth } from './AuthContext'

/** The "Sign in" and "Sign out" buttons in the header. */
export function SignInButtons() {
  const auth = useAuth()

  // Part 2: only user authentication has someone to sign in.
  // While we're still checking, show neither button: we don't know yet.
  if (config.authMode !== 'user' || auth.status === 'checking') return null
  if (auth.status === 'signedOut') return <button onClick={auth.signIn}>Sign in</button>
  return <button onClick={auth.signOut}>Sign out</button>
}
