import type { ReactNode } from 'react'
import { MAP_CENTER, MAP_ZOOM, REQUESTS_CENTER, REQUESTS_ZOOM } from '../config'
import { useMapView } from '../MapContext'
import { useWatch } from '../useWatch'

type HeaderProps = {
  title: string
  children?: ReactNode
}

export function Header({ title, children }: HeaderProps) {
  // Day 3: the header isn't inside the map, and it isn't the component that made it.
  // A ref can't reach from here, so it reads the view from the context.
  const view = useMapView()

  // Day 4, Step 2: yesterday's gap, closed. The view owns the zoom, and React follows it.
  const zoom = useWatch(() => view?.zoom, [view])

  return (
    <header className="app-header">
      <h1>{title}</h1>

      {/* Greyed out until the view exists */}
      <button disabled={!view} onClick={() => view?.goTo({ center: MAP_CENTER, zoom: MAP_ZOOM })}>
        Back to start
      </button>

      {/* Day 4, Step 1: the requests are a long way from the web map */}
      <button disabled={!view} onClick={() => view?.goTo({ center: REQUESTS_CENTER, zoom: REQUESTS_ZOOM })}>
        Go to the requests
      </button>

      {/* undefined until the map is ready */}
      <span>Zoom: {zoom === undefined ? '…' : zoom.toFixed(1)}</span>

      {children}
    </header>
  )
}
