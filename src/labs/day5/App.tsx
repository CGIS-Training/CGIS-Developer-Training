import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import './app.css'
import { setUpAuth } from './auth/auth'
import { AuthProvider } from './auth/AuthContext'
import { SignedInAs } from './auth/SignedInAs'
import { SignInButtons } from './auth/SignInButtons'
import { config, type AuthMode } from './config'
import { PageGuard } from './navigation/PageGuard'
import { PageNav } from './navigation/PageNav'
import { AccountPage } from './pages/AccountPage'
import { MapPage } from './pages/MapPage'

const MODE_NAMES: Record<AuthMode, string> = {
  none: 'Part 0: no sign-in',
  apiKey: 'Part 1: API key',
  user: 'Part 2: user authentication',
  app: 'Part 3: app authentication',
}

// The header stays on screen, and the page under it changes with the address
function LabShell() {
  return (
    <div className="auth-lab">
      <header className="auth-lab-header">
        <h1>Four Ways to Reach a Private Layer</h1>
        <PageNav />
        <span className="auth-mode">{MODE_NAMES[config.authMode]}</span>
        <SignedInAs />
        <SignInButtons />
      </header>

      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route
          path="/account"
          element={
            // The rule is the same one the header's link reads, from the list in navigation/pageList.ts
            <PageGuard rule="signedIn">
              <AccountPage />
            </PageGuard>
          }
        />
        {/* The catch-all: any address that nothing else matched */}
        <Route path="*" element={<p className="page-message">There's no page at this address.</p>} />
      </Routes>
    </div>
  )
}

type Setup = { status: 'starting' } | { status: 'ready' } | { status: 'failed'; reason: string }

// Waits for setUpAuth, then shows the app
function Lab() {
  // setUpAuth is a wait, so it's a status in state (Day 3: React can't wait, but it can render "not yet")
  const [setup, setSetup] = useState<Setup>({ status: 'starting' })

  useEffect(() => {
    let cancelled = false

    setUpAuth().then(
      () => {
        if (!cancelled) setSetup({ status: 'ready' })
      },
      (error: unknown) => {
        if (!cancelled) setSetup({ status: 'failed', reason: error instanceof Error ? error.message : String(error) })
      },
    )

    return () => {
      cancelled = true
    }
  }, [])

  if (setup.status === 'starting') return <p className="auth-lab-message">Setting up…</p>

  if (setup.status === 'failed') {
    return (
      <div className="auth-lab-message">
        <p>
          <strong>The lab couldn't start.</strong>
        </p>
        <p>{setup.reason}</p>
        {config.authMode === 'app' && <p>Is the token server running at {config.tokenUrl}?</p>}
      </div>
    )
  }

  return (
    <AuthProvider>
      <LabShell />
    </AuthProvider>
  )
}

/** The Day 5 lab: one private layer, reached four ways. VITE_AUTH_MODE in .env.development chooses the way. */
export default function App() {
  return (
    <BrowserRouter>
      <Lab />
    </BrowserRouter>
  )
}
