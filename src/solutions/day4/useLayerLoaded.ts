// Handout for Step 5 of the Day 3 lab: the finished Hook from this morning (Map View Loading).
// Give it a layer. It hands back 'loading', then 'loaded' or 'failed'.
import type Layer from '@arcgis/core/layers/Layer'
import { useEffect, useState } from 'react'

type LoadState = 'loading' | 'loaded' | 'failed'

export function useLayerLoaded(layer: Layer | null): LoadState {
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    if (!layer) return

    let cancelled = false

    async function waitForLayer(target: Layer) {
      try {
        await target.load() // the wait
        if (!cancelled) setState('loaded')
      } catch {
        if (!cancelled) setState('failed')
      }
    }

    setState('loading')
    waitForLayer(layer)

    return () => {
      cancelled = true // the component went away, or the layer changed
    }
  }, [layer])

  return state
}
