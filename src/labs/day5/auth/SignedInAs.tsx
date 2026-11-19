import { useAuth } from './AuthContext'
import { config } from '../config'

// The lab's one question, answered for the part that's running: who does the portal think is making this request?
function usePortalSees(): string {
  const auth = useAuth()

  switch (config.authMode) {
    case 'none':
      return 'Nobody'
    case 'apiKey':
      return 'An API key'
    case 'app':
      return 'The app'
    case 'user':
      if (auth.status === 'checking') return 'Checking…'
      if (auth.status === 'signedOut') return 'Nobody yet'
      return `${auth.user.fullName ?? auth.user.username} (${auth.user.username})`
  }
}

/** The label in the header. */
export function SignedInAs() {
  const who = usePortalSees()

  return (
    <span className="signed-in-as">
      The portal sees: <strong>{who}</strong>
    </span>
  )
}
