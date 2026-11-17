import { useLayers } from '../LayersContext'
import { layerTypeName } from './layerTypeNames'

export function LayerDetails() {
  const { selectedLayer } = useLayers()

  if (!selectedLayer) {
    return <p className="empty">Select a layer</p>
  }

  return (
    <dl className="layer-details">
      <dt>Title</dt>
      <dd>{selectedLayer.title || 'Untitled layer'}</dd>

      <dt>Type</dt>
      <dd>{layerTypeName(selectedLayer.layerType)}</dd>

      <dt>Address</dt>
      <dd className="address">{selectedLayer.url ?? 'No address'}</dd>

      <dt>Opacity</dt>
      <dd>{Math.round((selectedLayer.opacity ?? 1) * 100)}%</dd>

      <dt>Visible</dt>
      <dd>{(selectedLayer.visibility ?? true) ? 'Yes' : 'No'}</dd>
    </dl>
  )
}
