import { useState } from 'react'
import './app.css'
import { Header } from './layout/Header'
import { MapArea } from './layout/MapArea'
import { Panel } from './layout/Panel'
import { Sidebar } from './layout/Sidebar'
import { LayerDetails } from './layers/LayerDetails'
import { LayerList } from './layers/LayerList'
import { VisibleCount } from './layers/VisibleCount'
import { webMapLayers } from './webMapLayers'

/** The finished Day 1 lab: an app shell and a layers panel, built from a data file. */
export default function App() {
  // The list, the details panel, and the count all read the layers,
  // so the state lives here, in the component that contains them all
  const [layers, setLayers] = useState(webMapLayers)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  // Worked out from state on every render: we keep the ID, not a copy of the layer
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId)

  function toggleLayer(id: string) {
    // Replace, don't mutate: a new list, with a changed copy of the one layer
    setLayers(
      layers.map((layer) => (layer.id === id ? { ...layer, visibility: !(layer.visibility ?? true) } : layer)),
    )
  }

  return (
    <div className="app">
      <Header title="City Viewer" />

      <Sidebar>
        <Panel title="Layers">
          <VisibleCount layers={layers} />
          <LayerList
            layers={layers}
            selectedLayerId={selectedLayerId}
            onToggle={toggleLayer}
            onSelect={setSelectedLayerId}
          />
        </Panel>

        <Panel title="Details">
          <LayerDetails layer={selectedLayer} />
        </Panel>
      </Sidebar>

      <MapArea />
    </div>
  )
}
