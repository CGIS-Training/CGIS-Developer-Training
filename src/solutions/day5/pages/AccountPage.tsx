import type PortalGroup from '@arcgis/core/portal/PortalGroup'
import type PortalUser from '@arcgis/core/portal/PortalUser'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

type GroupsState = { status: 'loading' } | { status: 'loaded'; groups: PortalGroup[] } | { status: 'failed' }

// The user's groups are one more request to the portal, so they're one more wait
function useGroups(user: PortalUser): GroupsState {
  const [state, setState] = useState<GroupsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    user.fetchGroups().then(
      (groups) => {
        if (!cancelled) setState({ status: 'loaded', groups })
      },
      () => {
        if (!cancelled) setState({ status: 'failed' })
      },
    )

    return () => {
      cancelled = true
    }
  }, [user])

  return state
}

function AccountDetails({ user }: { user: PortalUser }) {
  const groups = useGroups(user)

  return (
    <div className="account-page">
      <h2>My account</h2>

      <dl>
        <dt>Name</dt>
        <dd>{user.fullName ?? 'Not given'}</dd>

        <dt>Username</dt>
        <dd>{user.username}</dd>

        <dt>Role</dt>
        <dd>{user.role ?? 'Not given'}</dd>
      </dl>

      {/* A rule for "members of one group" would look for a group's ID in this list (Sharing and Groups) */}
      <h3>My groups</h3>
      {groups.status === 'loading' && <p>Asking the portal…</p>}
      {groups.status === 'failed' && <p>The portal didn't say.</p>}
      {groups.status === 'loaded' && groups.groups.length === 0 && <p>None</p>}
      {groups.status === 'loaded' && (
        <ul>
          {groups.groups.map((group) => (
            <li key={group.id}>
              {group.title ?? 'Untitled group'} <small>{group.id}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** The page only a signed-in user can open: who the portal says they are, and the groups they belong to. */
export function AccountPage() {
  const auth = useAuth()

  // The guard around this page has already checked. This line is what tells TypeScript there's a user.
  if (auth.status !== 'signedIn') return null

  return <AccountDetails user={auth.user} />
}
