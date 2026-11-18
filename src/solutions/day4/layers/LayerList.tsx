import Graphic from '@arcgis/core/Graphic'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import type Layer from '@arcgis/core/layers/Layer'
import { useState } from 'react'
import { TRAILHEADS_URL } from '../config'
import { useMapView } from '../MapContext'
import { useSelectedLayerId } from '../useSelectedLayerId'
import { LayerListItem } from './LayerListItem'

// Step 6: one layer for all the pins, made once and kept outside the component
let pins = new GraphicsLayer({ title: 'Pins' })

// Step 4: the list reads its layers from the real map
export function LayerList() {
  const view = useMapView()
  const [selectedLayerId, selectLayer] = useSelectedLayerId()

  // map.layers, not map.allLayers, or the basemap's layers are listed too
  const layers = view?.map?.layers.toArray() ?? []

  // Step 6: adding a layer changes the map, and React isn't told. Setting this state is how we tell it.
  const [, setLayersAdded] = useState(0)

  // Step 5: a wait in a handler. Nothing on screen changes while it waits.
  async function zoomTo(layer: Layer) {
    await layer.load() // a layer doesn't know its extent until it has loaded
    if (layer.fullExtent) view?.goTo(layer.fullExtent)
  }

  // Step 6: a layer goes on the map. The view isn't involved.
  function addHighTrailheads() {
    view?.map?.add(
      new FeatureLayer({
        url: TRAILHEADS_URL,
        title: 'Trailheads above 1,000 ft',
        definitionExpression: 'ELEV_FT > 1000',
      }),
    )
    setLayersAdded((count) => count + 1)
  }

  // Step 6: where to put the pin comes from the view. The pin itself goes on the map, in a layer.
  function dropPin() {
    if (!view) return

    // "Hide map" destroys the old map, and its layers with it. A destroyed layer can't be used again.
    if (pins.destroyed) pins = new GraphicsLayer({ title: 'Pins' })

    if (!view.map?.layers.includes(pins)) {
      view.map?.add(pins)
      setLayersAdded((count) => count + 1)
    }

    pins.add(
      new Graphic({
        geometry: view.center,
        symbol: { type: 'simple-marker', color: 'crimson', size: 12 },
      }),
    )
  }

  // Step 5: a wait in state. Until the map's event hands over the view, there is something to show.
  if (!view) return <p className="empty">Loading map…</p>

  return (
    <>
      <ul className="layer-list">
        {layers.map((layer) => (
          <LayerListItem
            key={layer.id}
            layer={layer}
            selected={layer.id === selectedLayerId}
            onSelect={() => selectLayer(layer.id)}
            // The layer owns its visibility. There's no useState for it.
            onToggleVisible={() => {
              layer.visible = !layer.visible
            }}
            onZoomTo={() => zoomTo(layer)}
          />
        ))}
      </ul>

      <div className="layer-actions">
        <button onClick={addHighTrailheads}>Add high trailheads</button>
        <button onClick={dropPin}>Drop a pin at the center</button>
      </div>
    </>
  )
}
