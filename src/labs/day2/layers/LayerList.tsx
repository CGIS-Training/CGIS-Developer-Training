import type { WebMapLayer } from '../webMapLayers'
import { LayerListItem } from './LayerListItem'

type LayerListProps = {
  layers: WebMapLayer[]
  selectedLayerId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

export function LayerList({ layers, selectedLayerId, onToggle, onSelect }: LayerListProps) {
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
          selected={layer.id === selectedLayerId}
          onToggle={() => onToggle(layer.id)}
          onSelect={() => onSelect(layer.id)}
        />
      ))}
    </ul>
  )
}
