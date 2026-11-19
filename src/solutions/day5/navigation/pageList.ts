// Every page in the lab, and who may open it.
// The header's links and the guard on each page both read this one list, so a page's rule is written in one place.

// A new kind of rule, such as "members of one group", is added here and in canOpen, and nowhere else
export type PageRule = 'everyone' | 'signedIn'

type AuthStatus = 'checking' | 'signedOut' | 'signedIn'

export const PAGES: { path: string; label: string; rule: PageRule }[] = [
  { path: '/', label: 'Map', rule: 'everyone' },
  { path: '/account', label: 'My account', rule: 'signedIn' },
]

/** May someone with this sign-in status open a page with this rule? While we're still checking, the answer is "not yet". */
export function canOpen(rule: PageRule, status: AuthStatus) {
  return rule === 'everyone' || status === 'signedIn'
}
