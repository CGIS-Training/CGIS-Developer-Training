import '@esri/calcite-components/components/calcite-notice'
import type Graphic from '@arcgis/core/Graphic'
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
import { RequestDetails } from './requests/RequestDetails'
import { RequestsToggle } from './requests/RequestsToggle'

/** The finished Day 4 lab: a layer of our own, followed from React, selected from, and edited. */
export default function App() {
  const [showMap, setShowMap] = useState(true)

  // Day 4, Step 3: React owns "the selected request". The map isn't told.
  // It lives here because two parts of the page need it: the map, and the sidebar.
  const [selected, setSelected] = useState<Graphic | null>(null)

  // Day 4, Step 4: a successful save closes the form, so "Saved" is this component's to show
  const [justSaved, setJustSaved] = useState(false)

  return (
    <BrowserRouter>
      <MapProvider>
        <div className="app">
          <Header title="City Viewer">
            <button onClick={() => setShowMap(!showMap)}>{showMap ? 'Hide map' : 'Show map'}</button>
          </Header>

          <Sidebar>
            {/* Day 4, Step 2 */}
            <Panel title="Requests">
              <RequestsToggle />
            </Panel>

            {/* Day 4, Steps 3 and 4 */}
            <Panel title="Selected request">
              {justSaved && (
                <calcite-notice open kind="success">
                  <div slot="message">Saved</div>
                </calcite-notice>
              )}
              <RequestDetails
                feature={selected}
                onSaved={() => {
                  // The request we're holding is a copy from before the save, so let it go
                  setSelected(null)
                  setJustSaved(true)
                }}
              />
            </Panel>

            <Panel title="Layers">
              <LayerList />
            </Panel>

            <Panel title="Details">
              <LayerDetails />
            </Panel>
          </Sidebar>

          {showMap && (
            <MapArea
              onSelect={(feature) => {
                setSelected(feature)
                setJustSaved(false)
              }}
            />
          )}
        </div>
      </MapProvider>
    </BrowserRouter>
  )
}
