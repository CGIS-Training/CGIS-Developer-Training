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

/** The finished Day 2 lab: the Day 1 app, with its layers held in a context instead of passed as props. */
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
