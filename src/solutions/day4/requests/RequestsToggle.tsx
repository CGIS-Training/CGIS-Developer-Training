import { useMapView } from '../MapContext'
import { useWatch } from '../useWatch'
import { findRequestsLayer } from './findRequestsLayer'

// Day 4, Step 2: a checkbox that follows the layer. There's no useState for "visible" here.
export function RequestsToggle() {
  const view = useMapView()

  // The layer owns "visible", and React follows it. It's undefined until the layer is in the map.
  const visible = useWatch(() => findRequestsLayer(view)?.visible, [view])

  if (visible === undefined) return <p className="empty">Loading the requests…</p>

  return (
    <label className="request-toggle">
      <input
        type="checkbox"
        checked={visible}
        onChange={(event) => {
          // Find the layer when it's needed, and write to it. Nothing else is written.
          const layer = findRequestsLayer(view)
          if (layer) layer.visible = event.target.checked
        }}
      />
      Show the service requests
    </label>
  )
}
