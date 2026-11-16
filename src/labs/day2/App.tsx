import { useState } from 'react'
import { BrowserRouter } from 'react-router'
import './app.css'
import { Header } from './layout/Header'
import { MapArea } from './layout/MapArea'
import { Panel } from './layout/Panel'
import { Sidebar } from './layout/Sidebar'
import { LayerDetails } from './layers/LayerDetails'
import { LayerList } from './layers/LayerList'
import { VisibleCount } from './layers/VisibleCount'
import { webMapLayers } from './webMapLayers'

/** The Day 2 lab starts here: the finished Day 1 lab, with the router around it. */
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

  // The router goes around the whole app, once. Step 6 of the lab needs it.
  // Keep it outermost: the LayersProvider from Step 1 goes inside it.
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
