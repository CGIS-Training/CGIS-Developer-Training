import type Layer from '@arcgis/core/layers/Layer'
import { useLayerLoaded } from '../useLayerLoaded'
import { layerKindName } from './layerKindNames'

type LayerListItemProps = {
  layer: Layer
  selected: boolean
  onSelect: () => void
  onToggleVisible: () => void
  onZoomTo: () => void
}

// Step 5: each row waits for its own layer. A Hook can't be called inside a loop,
// so the Hook is here, in the row's own component, and the row takes the whole layer.
export function LayerListItem({ layer, selected, onSelect, onToggleVisible, onZoomTo }: LayerListItemProps) {
  const status = useLayerLoaded(layer)

  return (
    <li className={selected ? 'layer-row selected' : 'layer-row'}>
      <button className="layer-row-button" onClick={onSelect}>
        <span className="layer-title">{layer.title ?? 'Untitled layer'}</span>
        {status === 'loading' && <small>Loading…</small>}
        {status === 'failed' && <small>Couldn't be loaded</small>}
        {/* Step 4: the layer's kind, from layer.type */}
        {status === 'loaded' && <small>{layerKindName(layer.type)}</small>}
      </button>

      {/* The row asks, and the list does it: a prop is read-only, so the row doesn't change the layer itself */}
      <button className="row-action" disabled={status !== 'loaded'} onClick={onToggleVisible}>
        Show / hide
      </button>
      <button className="row-action" disabled={status !== 'loaded'} onClick={onZoomTo}>
        Zoom to
      </button>
    </li>
  )
}
