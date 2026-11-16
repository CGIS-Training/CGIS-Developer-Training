import type { WebMapLayer } from '../webMapLayers'

// Worked out from the layers on every render, so it needs no state of its own
export function VisibleCount({ layers }: { layers: WebMapLayer[] }) {
  const visibleCount = layers.filter((layer) => layer.visibility ?? true).length

  return (
    <p className="visible-count">
      {visibleCount} of {layers.length} visible
    </p>
  )
}
