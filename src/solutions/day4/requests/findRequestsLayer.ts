import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import type MapView from '@arcgis/core/views/MapView'
import { REQUESTS_LAYER_ID } from '../config'

/**
 * Day 4, Step 2: finds the layer our code added, by the ID we gave it.
 * It's in a file of its own because three components need the layer: the checkbox, the map, and the form.
 */
export function findRequestsLayer(view: MapView | null) {
  const layer = view?.map?.findLayerById(REQUESTS_LAYER_ID)

  // The check tells TypeScript which kind of layer this is. It's undefined until the map is ready.
  return layer instanceof FeatureLayer ? layer : undefined
}
