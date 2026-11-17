import { BrowserRouter } from 'react-router'
import './app.css'
import { Header } from './layout/Header'
import { MapArea } from './layout/MapArea'
import { Panel } from './layout/Panel'
import { Sidebar } from './layout/Sidebar'
import { LayerDetails } from './layers/LayerDetails'
import { LayerList } from './layers/LayerList'
import { VisibleCount } from './layers/VisibleCount'
import { LayersProvider } from './LayersContext'

/** The Day 3 lab starts here: the finished Day 2 lab, with this morning's map in the map area. */
export default function App() {
  // No state and no layer props here. This component only arranges the page.
  // The router stays outermost: the selected layer is in the URL.
  return (
    <BrowserRouter>
      <LayersProvider>
        <div className="app">
          <Header title="City Viewer" />

          <Sidebar>
            <Panel title="Layers">
              <VisibleCount />
              <LayerList />
            </Panel>

            <Panel title="Details">
              <LayerDetails />
            </Panel>
          </Sidebar>

          <MapArea />
        </div>
      </LayersProvider>
    </BrowserRouter>
  )
}
