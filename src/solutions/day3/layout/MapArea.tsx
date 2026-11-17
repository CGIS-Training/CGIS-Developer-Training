import '@arcgis/map-components/components/arcgis-map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { useEffect } from 'react'
import { MISSING_LAYER_URL, WEB_MAP_ID } from '../config'
import { useSetMapView } from '../MapContext'

const BROKEN_LAYER_TITLE = 'Zoning'

// Step 3: this component makes the map, so it fills the context, and clears it when the map goes away.
// The ref from Step 1, and the state and the logging effect from the Basic Lab, are gone.
export function MapArea() {
  const setView = useSetMapView()

  // Nothing to do at the start. The cleanup runs when this component leaves the page.
  useEffect(() => () => setView(null), [setView])

  return (
    <main className="map-area">
      <arcgis-map
        item-id={WEB_MAP_ID}
        onarcgisViewReadyChange={(event) => {
          const map = event.target.map

          // Step 5: a layer whose service doesn't exist, added once
          if (event.target.ready && map && !map.layers.some((layer) => layer.title === BROKEN_LAYER_TITLE)) {
            map.add(new FeatureLayer({ url: MISSING_LAYER_URL, title: BROKEN_LAYER_TITLE }))
          }

          setView(event.target.ready ? event.target.view : null)
        }}
      />
    </main>
  )
}
