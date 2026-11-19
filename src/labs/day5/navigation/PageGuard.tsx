import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { config } from '../config'
import { canOpen, type PageRule } from './pageList'

/**
 * Shows a page only to someone its rule allows. Everyone else gets a sign-in prompt in its place.
 * It decides what's on the screen, and nothing more. What a user can load or edit is still the portal's
 * decision, made from the item's sharing (Security Habits: the service enforces permissions, not the screen).
 */
export function PageGuard({ rule, children }: { rule: PageRule; children: ReactNode }) {
  const auth = useAuth()

  // Coming back from the portal's sign-in page, the app starts again and doesn't know yet who it is
  if (auth.status === 'checking') return <p className="page-message">Checking who's signed in…</p>

  if (!canOpen(rule, auth.status)) {
    return (
      <div className="page-message">
        <h2>Sign in to see this page</h2>
        {config.authMode === 'user' ? (
          <button onClick={auth.signIn}>Sign in</button>
        ) : (
          <p>This part of the lab has nobody to sign in. Set VITE_AUTH_MODE to user, and restart the dev server.</p>
        )}
        <p>
          <Link to="/">Back to the map</Link>
        </p>
      </div>
    )
  }

  return children
}
