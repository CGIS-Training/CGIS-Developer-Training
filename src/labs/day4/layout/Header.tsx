import type { ReactNode } from 'react'
import { MAP_CENTER, MAP_ZOOM } from '../config'
import { useMapView } from '../MapContext'

type HeaderProps = {
  title: string
  children?: ReactNode
}

export function Header({ title, children }: HeaderProps) {
  // Step 3: the header isn't inside the map, and it isn't the component that made it.
  // A ref can't reach from here, so it reads the view from the context.
  const view = useMapView()

  return (
    <header className="app-header">
      <h1>{title}</h1>

      {/* Greyed out until the view exists */}
      <button disabled={!view} onClick={() => view?.goTo({ center: MAP_CENTER, zoom: MAP_ZOOM })}>
        Back to start
      </button>

      {/* Step 7: the gap. Zoom the map, and this label doesn't change. Day 4 starts here. */}
      <span>Zoom: {view ? view.zoom.toFixed(1) : '…'}</span>

      {children}
    </header>
  )
}
