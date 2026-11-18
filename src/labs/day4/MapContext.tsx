// The Step 2 handout, with its four TODOs filled in
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type MapView from '@arcgis/core/views/MapView'

type MapContextValue = {
  view: MapView | null
  setView: (view: MapView | null) => void
}

// TODO 1: null means "there is no Provider above this component"
const MapContext = createContext<MapContextValue | null>(null)

export function MapProvider({ children }: { children: ReactNode }) {
  // TODO 2: the view starts as null, because it doesn't exist until the map is ready
  const [view, setView] = useState<MapView | null>(null)

  // Provided: keeps the same object until the view changes
  const value = useMemo(() => ({ view, setView }), [view])

  // TODO 3
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

function useMapContext() {
  const context = useContext(MapContext)
  // TODO 4
  if (!context) {
    throw new Error('useMapView must be used inside <MapProvider>')
  }
  return context
}

// Provided: the two Hooks the rest of the app uses

export function useMapView() {
  return useMapContext().view
}

export function useSetMapView() {
  return useMapContext().setView
}
