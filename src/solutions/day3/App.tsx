import { useState } from 'react'
import { BrowserRouter } from 'react-router'
import './app.css'
import { Header } from './layout/Header'
import { MapArea } from './layout/MapArea'
import { Panel } from './layout/Panel'
import { Sidebar } from './layout/Sidebar'
import { LayerDetails } from './layers/LayerDetails'
import { LayerList } from './layers/LayerList'
import { MapProvider } from './MapContext'

/** The finished Day 3 lab: a map context, the map's own layers in the sidebar, and two layers of our own. */
export default function App() {
  // Step 3: taking the map off the page tests the cleanup. The view in the context goes back to null.
  const [showMap, setShowMap] = useState(true)

  // Step 2: the Provider goes above everything that needs the view.
  // Step 4: Day 2's LayersProvider is gone, because the map owns its layers.
  return (
    <BrowserRouter>
      <MapProvider>
        <div className="app">
          <Header title="City Viewer">
            <button onClick={() => setShowMap(!showMap)}>{showMap ? 'Hide map' : 'Show map'}</button>
          </Header>

          <Sidebar>
            <Panel title="Layers">
              <LayerList />
            </Panel>

            <Panel title="Details">
              <LayerDetails />
            </Panel>
          </Sidebar>

          {showMap && <MapArea />}
        </div>
      </MapProvider>
    </BrowserRouter>
  )
}
