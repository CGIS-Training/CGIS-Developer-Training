import type Graphic from '@arcgis/core/Graphic'
import { EDIT_FIELD, NAME_FIELD } from '../config'
import { useMapView } from '../MapContext'
import { findRequestsLayer } from './findRequestsLayer'
import { StatusForm } from './StatusForm'

type RequestDetailsProps = {
  feature: Graphic | null
  onSaved: () => void
}

// Day 4, Step 3: the clicked request, in a panel of our own
export function RequestDetails({ feature, onSaved }: RequestDetailsProps) {
  const view = useMapView()
  const layer = findRequestsLayer(view)

  if (!feature) return <p className="empty">Select a request</p>

  return (
    <>
      <dl className="layer-details">
        <dt>Type</dt>
        <dd>{feature.attributes[NAME_FIELD]}</dd>

        <dt>Status</dt>
        <dd>{feature.attributes[EDIT_FIELD]}</dd>
      </dl>

      {/* Day 4, Step 4: the key gives each request its own form. Select another, and the draft starts over. */}
      {layer && <StatusForm key={feature.getObjectId()} feature={feature} layer={layer} onSaved={onSaved} />}
    </>
  )
}
