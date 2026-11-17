import type { ReactNode } from 'react'

// A placeholder until the real map arrives on Day 3
export function MapArea({ children }: { children?: ReactNode }) {
  return (
    <main className="map-area">
      <p className="map-placeholder">Map goes here</p>
      {children}
    </main>
  )
}
