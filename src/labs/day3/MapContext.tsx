// Handout for Step 2 of the Day 3 lab. The types and the outline are in place: fill in the four TODOs.
// This file has red underlines until all four are done. Nothing uses it before Step 2, so the app still runs.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type MapView from '@arcgis/core/views/MapView'

type MapContextValue = {
  view: MapView | null
  setView: (view: MapView | null) => void
}

// TODO 1: Create the context.
// Its value is a MapContextValue, or null when there is no Provider.
const MapContext = /* ... */

export function MapProvider({ children }: { children: ReactNode }) {
  // TODO 2: Hold the view in state. It starts as null.

  // Provided: keeps the same object until the view changes
  const value = useMemo(() => ({ view, setView }), [view])

  // TODO 3: Return the Provider, with `value`, wrapped around `children`.
}

function useMapContext() {
  const context = useContext(MapContext)
  // TODO 4: If there is no Provider, throw an error that says so.
  return context
}

// Provided: the two Hooks the rest of the app uses

export function useMapView() {
  return useMapContext().view
}

export function useSetMapView() {
  return useMapContext().setView
}
