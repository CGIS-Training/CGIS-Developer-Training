// Who is signed in, for Part 2. The same shape as the map context from Day 3:
// a Provider that holds a value that starts out unknown, and a Hook that reads it.
import identityManager from '@arcgis/core/identity/IdentityManager'
import Portal from '@arcgis/core/portal/Portal'
import type PortalUser from '@arcgis/core/portal/PortalUser'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { config } from '../config'

const SHARING_URL = `${config.portalUrl}/sharing`

// Only user authentication has a person to look for. In the other three parts, nobody ever signs in.
const HAS_USERS = config.authMode === 'user'

type AuthState = { status: 'checking' } | { status: 'signedOut' } | { status: 'signedIn'; user: PortalUser }

type AuthContextValue = AuthState & { signIn: () => void; signOut: () => void }

const AuthContext = createContext<AuthContextValue | null>(null)

// Is someone signed in, and who?
async function findUser() {
  await identityManager.checkSignInStatus(SHARING_URL) // fails if nobody is signed in
  const portal = new Portal()
  await portal.load()
  return portal.user
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(HAS_USERS ? { status: 'checking' } : { status: 'signedOut' })

  useEffect(() => {
    if (!HAS_USERS) return

    let cancelled = false

    async function check() {
      try {
        const user = await findUser()
        if (!cancelled && user) setState({ status: 'signedIn', user })
      } catch {
        if (!cancelled) setState({ status: 'signedOut' })
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [])

  // Sends the user to the portal's sign-in page, then back to our app
  function signIn() {
    identityManager.getCredential(SHARING_URL)
  }

  function signOut() {
    identityManager.destroyCredentials()
    window.location.reload()
  }

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
