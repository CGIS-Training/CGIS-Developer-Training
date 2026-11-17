// Steps 1 and 2: the context, its Provider, and the Hook that reads it. Steps 4 to 6 changed only this file.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { PORTAL_URL, WEB_MAP_ID } from './config'
import type { WebMapLayer } from './webMapLayers'

type LayersStatus = 'loading' | 'ready' | 'failed'

type LayersContextValue = {
  layers: WebMapLayer[]
  status: LayersStatus
  selectedLayer: WebMapLayer | undefined
  toggleLayer: (id: string) => void
  selectLayer: (id: string) => void
}

// null means "there is no Provider above this component"
const LayersContext = createContext<LayersContextValue | null>(null)

// Step 5: the service can answer "success" with an error object inside, so check before using it
function readLayers(data: unknown): WebMapLayer[] | null {
  if (typeof data !== 'object' || data === null) return null
  if (!('operationalLayers' in data) || !Array.isArray(data.operationalLayers)) return null
  return data.operationalLayers
}

export function LayersProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<WebMapLayer[]>([])
  const [status, setStatus] = useState<LayersStatus>('loading')

  // Step 6: the selected layer's ID lives in the URL, not in state
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedLayerId = searchParams.get('layer')
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId)

  // Step 4: load the layers from the web map's own document
  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await fetch(`${PORTAL_URL}/sharing/rest/content/items/${WEB_MAP_ID}/data?f=json`)
        const loaded = readLayers(await response.json())
        if (ignore) return

        if (loaded) {
          setLayers(loaded)
          setStatus('ready')
        } else {
          setStatus('failed')
        }
      } catch {
        if (!ignore) setStatus('failed')
      }
    }
    load()

    return () => {
      ignore = true
    }
  }, [])

  function toggleLayer(id: string) {
    // Replace, don't mutate: a new list, with a changed copy of the one layer
    setLayers(
      layers.map((layer) => (layer.id === id ? { ...layer, visibility: !(layer.visibility ?? true) } : layer)),
    )
  }

  function selectLayer(id: string) {
    setSearchParams({ layer: id })
  }

  return (
    <LayersContext.Provider value={{ layers, status, selectedLayer, toggleLayer, selectLayer }}>
      {children}
    </LayersContext.Provider>
  )
}

// Step 2
export function useLayers() {
  const context = useContext(LayersContext)
  if (!context) {
    throw new Error('useLayers must be used inside <LayersProvider>')
  }
  return context
}
