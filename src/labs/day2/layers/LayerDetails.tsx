import type { WebMapLayer } from '../webMapLayers'
import { layerTypeName } from './layerTypeNames'

export function LayerDetails({ layer }: { layer?: WebMapLayer }) {
  if (!layer) {
    return <p className="empty">Select a layer</p>
  }

  return (
    <dl className="layer-details">
      <dt>Title</dt>
      <dd>{layer.title || 'Untitled layer'}</dd>

      <dt>Type</dt>
      <dd>{layerTypeName(layer.layerType)}</dd>

      <dt>Address</dt>
      <dd className="address">{layer.url ?? 'No address'}</dd>

      <dt>Opacity</dt>
      <dd>{Math.round((layer.opacity ?? 1) * 100)}%</dd>

      <dt>Visible</dt>
      <dd>{(layer.visibility ?? true) ? 'Yes' : 'No'}</dd>
    </dl>
  )
}
