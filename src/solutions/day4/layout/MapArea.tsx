import '@arcgis/map-components/components/arcgis-map'
import type Graphic from '@arcgis/core/Graphic'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { useEffect } from 'react'
import { MISSING_LAYER_URL, REQUESTS_FILTER, REQUESTS_LAYER_ID, REQUESTS_URL, WEB_MAP_ID } from '../config'
import { useSetMapView } from '../MapContext'
import { findRequestsLayer } from '../requests/findRequestsLayer'

const BROKEN_LAYER_TITLE = 'Zoning'

type MapAreaProps = {
  onSelect: (feature: Graphic | null) => void
}

// Day 3: this component makes the map, so it fills the context, and clears it when the map goes away.
export function MapArea({ onSelect }: MapAreaProps) {
  const setView = useSetMapView()

  // Nothing to do at the start. The cleanup runs when this component leaves the page.
  useEffect(() => () => setView(null), [setView])

  return (
    <main className="map-area">
      <arcgis-map
        item-id={WEB_MAP_ID}
        // Day 4, Step 3: Esri's popup is off, because the clicked request goes in our own panel
        popupDisabled
        onarcgisViewReadyChange={(event) => {
          const map = event.target.map

          // Day 3, Step 5: a layer whose service doesn't exist, added once
          if (event.target.ready && map && !map.layers.some((layer) => layer.title === BROKEN_LAYER_TITLE)) {
            map.add(new FeatureLayer({ url: MISSING_LAYER_URL, title: BROKEN_LAYER_TITLE }))
          }

          // Day 4, Step 1: the layer we'll edit, added once, with an ID of our own.
          // It goes in before the view is shared, so every component that looks for it finds it.
          if (event.target.ready && map && !map.findLayerById(REQUESTS_LAYER_ID)) {
            map.add(
              new FeatureLayer({
                id: REQUESTS_LAYER_ID, // so we can find it again
                url: REQUESTS_URL,
                title: 'Service requests',
                outFields: ['*'], // every field, so a clicked request arrives with all of its values
                definitionExpression: REQUESTS_FILTER, // only the requests with a real status
              }),
            )
          }

          setView(event.target.ready ? event.target.view : null)
        }}
        // Day 4, Step 3: a click is only a place. A hit test asks the map what is drawn there.
        onarcgisViewClick={async (event) => {
          const layer = findRequestsLayer(event.target.view)
          if (!layer) return
          const response = await event.target.hitTest(event.detail, { include: [layer] })
          const first = response.results[0]
          // Nothing under the click gives null, which clears the selection
          onSelect(first?.type === 'graphic' ? first.graphic : null)
        }}
      />
    </main>
  )
}
