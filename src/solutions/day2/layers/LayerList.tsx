import { useLayers } from '../LayersContext'
import { LayerListItem } from './LayerListItem'

export function LayerList() {
  const { layers, status, selectedLayer, toggleLayer, selectLayer } = useLayers()

  if (status === 'loading') {
    return <p className="empty">Loading layers…</p>
  }

  if (status === 'failed') {
    return <p className="empty">Couldn't load the layers.</p>
  }

  if (layers.length === 0) {
    return <p className="empty">This map has no layers.</p>
  }

  return (
    <ul className="layer-list">
      {layers.map((layer) => (
        <LayerListItem
          key={layer.id}
          title={layer.title || 'Untitled layer'}
          layerType={layer.layerType}
          visible={layer.visibility ?? true}
          selected={layer.id === selectedLayer?.id}
          onToggle={() => toggleLayer(layer.id)}
          onSelect={() => selectLayer(layer.id)}
        />
      ))}
    </ul>
  )
}
