import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { useMapView } from '../MapContext'
import { useSelectedLayerId } from '../useSelectedLayerId'
import { layerKindName } from './layerKindNames'

// Step 4: the selected layer's ID is still in the URL. The layer itself is looked up on the map.
export function LayerDetails() {
  const view = useMapView()
  const [selectedLayerId] = useSelectedLayerId()
  const layer = selectedLayerId ? view?.map?.findLayerById(selectedLayerId) : undefined

  if (!view) return <p className="empty">Loading map…</p>
  if (!layer) return <p className="empty">Select a layer</p>

  return (
    <dl className="layer-details">
      <dt>Title</dt>
      <dd>{layer.title ?? 'Untitled layer'}</dd>

      <dt>Kind</dt>
      <dd>{layerKindName(layer.type)}</dd>

      {/* Only some kinds of layer have an address and a filter, so check which kind this is first */}
      <dt>Address</dt>
      <dd className="address">{layer instanceof FeatureLayer ? (layer.url ?? 'No address') : 'No address'}</dd>

      {/* Step 6 */}
      <dt>Filter</dt>
      <dd>{layer instanceof FeatureLayer ? layer.definitionExpression || 'None' : 'None'}</dd>

      {/* Step 7: part of the gap. Click "Show / hide", and this doesn't follow. */}
      <dt>Visible</dt>
      <dd>{layer.visible ? 'Yes' : 'No'}</dd>
    </dl>
  )
}
