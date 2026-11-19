import { NavLink } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { canOpen, PAGES } from './pageList'

/**
 * The links in the header. A page the user may not open is still listed, but it isn't a link.
 * This is a courtesy, not a lock: typing the address still reaches the page, and the guard there is what answers.
 */
export function PageNav() {
  const auth = useAuth()

  return (
    <nav className="page-nav">
      {PAGES.map((page) =>
        canOpen(page.rule, auth.status) ? (
          // `end` marks a link as the current page only on its own address, not on every address under it
          <NavLink key={page.path} to={page.path} end>
            {page.label}
          </NavLink>
        ) : (
          <span key={page.path} className="disabled" aria-disabled="true" title="Sign in to open this page">
            {page.label}
          </span>
        ),
      )}
    </nav>
  )
}
