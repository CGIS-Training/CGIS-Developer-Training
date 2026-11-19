import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import type MapView from '@arcgis/core/views/MapView'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { config, PUBLIC_LAYER_URL } from '../config'
import { LabMap } from '../map/LabMap'
import { LayerStatus } from '../map/LayerStatus'

/** The lab's main page: the layer list, and the map. Anyone can open it; what loads on it is the portal's decision. */
export function MapPage() {
  const auth = useAuth()
  const [view, setView] = useState<MapView | null>(null)

  // Each layer is made once and kept. Making a layer asks for nothing; loading it does.
  const [publicLayer] = useState(() => new FeatureLayer({ url: PUBLIC_LAYER_URL, title: 'Trailheads (public)' }))
  const [privateLayer] = useState(() =>
    config.privateLayerUrl ? new FeatureLayer({ url: config.privateLayerUrl, title: 'Private layer' }) : null,
  )

  // Part 2: asking for the private layer with nobody signed in would send the user straight to the portal's
  // sign-in page, before they'd clicked anything. So the page waits for the sign-in.
  const waitingForSignIn = config.authMode === 'user' && auth.status !== 'signedIn'

  async function zoomTo(layer: FeatureLayer) {
    await layer.load() // a layer doesn't know its extent until it has loaded
    if (layer.fullExtent) view?.goTo(layer.fullExtent)
  }

  return (
    <div className="map-page">
      <aside className="auth-lab-side">
        <h2>Layers</h2>
        <LayerStatus
          publicLayer={publicLayer}
          privateLayer={privateLayer}
          waitingForSignIn={waitingForSignIn}
          onZoomTo={zoomTo}
        />
      </aside>

      <main className="auth-lab-map">
        <LabMap publicLayer={publicLayer} privateLayer={waitingForSignIn ? null : privateLayer} onViewChange={setView} />
      </main>
    </div>
  )
}
