import '@arcgis/map-components/components/arcgis-map'
import type EsriMap from '@arcgis/core/Map'
import type MapView from '@arcgis/core/views/MapView'
import { useEffect, useState } from 'react'
import { WEB_MAP_ID } from '../config'

// This morning's Basic Lab: the map, with its view and its map caught in state
export function MapArea() {
  // Both start as null, because neither exists until the map is ready
  const [view, setView] = useState<MapView | null>(null)
  const [map, setMap] = useState<EsriMap | null>(null)

  useEffect(() => {
    if (!view || !map) return // not ready yet
    console.log('The view:', view)
    console.log('The map:', map)
    console.log('Layers in the map:', map.layers.length)
  }, [view, map])

  return (
    <main className="map-area">
      <arcgis-map
        item-id={WEB_MAP_ID}
        onarcgisViewReadyChange={(event) => {
          if (!event.target.ready) return
          setView(event.target.view)
          setMap(event.target.map ?? null)
        }}
      />
    </main>
  )
}
