import type FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { useEffect, useState } from 'react'

type LoadState = { status: 'loading' } | { status: 'loaded' } | { status: 'failed'; reason: string }

// Waits for one layer, and keeps the reason when it fails (Day 3: any load can fail quietly)
function useLayerLoad(layer: FeatureLayer): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    layer.load().then(
      () => {
        if (!cancelled) setState({ status: 'loaded' })
      },
      (error: unknown) => {
        if (!cancelled) setState({ status: 'failed', reason: error instanceof Error ? error.message : String(error) })
      },
    )

    return () => {
      cancelled = true
    }
  }, [layer])

  return state
}

function LayerRow({ layer, onZoomTo }: { layer: FeatureLayer; onZoomTo: (layer: FeatureLayer) => void }) {
  const load = useLayerLoad(layer)

  return (
    <li className={`layer-row ${load.status}`}>
      <span className="layer-title">{layer.title}</span>
      {load.status === 'loading' && <small>Asking for it…</small>}
      {load.status === 'loaded' && (
        <>
          <small>Loaded</small>
          <button onClick={() => onZoomTo(layer)}>Zoom to</button>
        </>
      )}
      {load.status === 'failed' && <small>Not loaded: {load.reason}</small>}
    </li>
  )
}

type LayerStatusProps = {
  publicLayer: FeatureLayer
  // null when VITE_PRIVATE_LAYER_URL is empty
  privateLayer: FeatureLayer | null
  // Part 2: the private layer isn't asked for until someone has signed in
  waitingForSignIn: boolean
  onZoomTo: (layer: FeatureLayer) => void
}

/** One line for each layer, saying whether it loaded, and the reason when it didn't. */
export function LayerStatus({ publicLayer, privateLayer, waitingForSignIn, onZoomTo }: LayerStatusProps) {
  return (
    <ul className="layer-status">
      <LayerRow layer={publicLayer} onZoomTo={onZoomTo} />

      {!privateLayer && (
        <li className="layer-row">
          <span className="layer-title">Private layer</span>
          <small>No address yet. Put one in VITE_PRIVATE_LAYER_URL, and restart the dev server.</small>
        </li>
      )}

      {privateLayer && waitingForSignIn && (
        <li className="layer-row">
          <span className="layer-title">{privateLayer.title}</span>
          <small>Sign in to load it</small>
        </li>
      )}

      {privateLayer && !waitingForSignIn && <LayerRow layer={privateLayer} onZoomTo={onZoomTo} />}
    </ul>
  )
}
