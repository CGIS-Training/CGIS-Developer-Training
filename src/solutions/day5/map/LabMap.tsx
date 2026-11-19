import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-zoom'
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import type EsriMap from '@arcgis/core/Map'
import type MapView from '@arcgis/core/views/MapView'
import { useEffect, useState } from 'react'
import { MAP_CENTER, MAP_ZOOM } from '../config'
import { useAuth } from '../auth/AuthContext'

type LabMapProps = {
  publicLayer: FeatureLayer
  // null until the page is ready to ask for it
  privateLayer: FeatureLayer | null
  onViewChange: (view: MapView | null) => void
}

/** The map. It's the same in every part of the lab: it adds the layers it's given, and knows nothing about sign-in. */
export function LabMap({ publicLayer, privateLayer, onViewChange }: LabMapProps) {
  const [map, setMap] = useState<EsriMap | null>(null)
  const auth = useAuth();
  console.log(auth)

  useEffect(() => {
    if (!map) return

    // The ready event can fire again, so check a layer isn't already in the map
    for (const layer of [publicLayer, privateLayer]) {
      if (layer && !map.layers.includes(layer)) map.add(layer)
    }
  }, [map, publicLayer, privateLayer])

  return (
    <arcgis-map
      basemap="topo-vector"
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      onarcgisViewReadyChange={(event) => {
        const ready = event.target.ready
        setMap(ready ? (event.target.map ?? null) : null)
        onViewChange(ready ? event.target.view : null)
      }}
    >
      <arcgis-zoom slot="top-left" />
    </arcgis-map>
  )
}
