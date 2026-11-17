# Day 3 Lab: The Map Takes Over

Share the map's view with the whole app, let the map take over the layers panel from Day 2, then add layers of our own.

- **Time:** about 70 minutes
- **You will use:** web components, the map's ready event, a ref, the map and the view, kinds of layer, waiting for things to load, a layer that fails quietly, and a map context

| Part | Steps | What happens |
|---|---|---|
| 1. Share the view | 1 to 3 | Try a ref, find its limit, then build a map context |
| 2. The map takes over the layers | 4 and 5 | The panel reads the map's own layers, and waits where it has to |
| 3. Layers of our own | 6 and 7 | Add two layers in code, then see what React still can't see |

## Three days, one panel

- Day 1: the layers panel read a data file.
- Day 2: it read the web map's document, loaded into a context of ours.
- Today: it reads the live map. The context of ours goes away, because the map owns its layers.

## Before you start

- Your code goes in this folder, `src/labs/day3`. It already works.
- To see it, open `src/main.tsx` and change the import line to `import App from './labs/day3/App'`.
- It starts as the finished Day 2 lab, with this morning's map in the map area:
  - The sidebar has the layers panel and the details panel. Day 2's `LayersProvider` fills them, and the selected layer is in the URL as `?layer=`.
  - The map area has `<arcgis-map>`, with the view and the map kept in state, as in this morning's Basic Lab.
- Right now the sidebar and the map don't know about each other. Turn off a layer's checkbox, and nothing happens on the map. This lab fixes that.

| File | What it is |
|---|---|
| `layout/MapArea.tsx` | The map from this morning's Basic Lab |
| `LayersContext.tsx` | The finished context from the Day 2 lab. Step 4 deletes it. |
| `MapContext.tsx` | **Handout** for Step 2: a map context with four gaps to fill in |
| `useLayerLoaded.ts` | **Handout** for Step 5: the finished Hook from this morning. It takes a layer, and hands back `'loading'`, `'loaded'`, or `'failed'`. |
| `config.ts` | The values the steps ask for. See **The data**, below. |
| `app.css` | The styles. The top of the file lists three new things for today's buttons. |

- `MapContext.tsx` has red underlines until you fill in its four gaps in Step 2. That's expected. Nothing uses the file before then, so the app still runs.

## The data

- A web map: Esri's public "LA Parks and Trails" map. It shows parks, trails, and trailheads in the Santa Monica Mountains, and it has four layers of its own.
- It's the map from this morning's demos, and the one yesterday's lab loaded its layers from.
- It's public, so there is no sign-in. Day 5 covers signing in.
- `config.ts` has everything the steps need:

| Value | What it is | Step |
|---|---|---|
| `WEB_MAP_ID` | The web map's item ID | Already in use |
| `MAP_CENTER`, `MAP_ZOOM` | Where "Back to start" goes | 1 and 3 |
| `MISSING_LAYER_URL` | The address of a service that doesn't exist | 5 |
| `TRAILHEADS_URL` | The address of the Trailheads layer | 6 |

## Part 1: Share the view

### Step 1: Try a ref first (about 5 min)

- In `layout/MapArea.tsx`, add a "Back to start" button inside `<main>`, just before the map.
- Reach the map with a ref: make one with `useRef<HTMLArcgisMapElement>(null)`, and give it to the map as `ref={mapRef}`.
- When the button is clicked, call the map's `goTo` with `{ center: MAP_CENTER, zoom: MAP_ZOOM }`. The ref is empty until the map is on the page, so use `mapRef.current?.goTo(...)`.

**Checkpoint:** pan and zoom the map, click the button, and the map returns to where it started.

- Now move the button to `layout/Header.tsx`, where it belongs. It stops working: `mapRef` isn't there.
- A ref reaches the map from one component. The header and the sidebar aren't that component.
- Passing the view down as a prop would mean every component in between has to carry it. That's Day 2's prop drilling.
- Leave the button in the header, and take its `onClick` off for now. Step 3 makes it work again.

### Step 2: Build the context, and place it (about 10 min)

- Open the `MapContext.tsx` handout and fill in the four TODOs.
- It has the same three parts as yesterday's context: `createContext`, a Provider, and a Hook that throws an error when the Provider is missing.
- One difference from yesterday: the view inside the value starts as `null`, because it doesn't exist until the map is ready.
  - The context being `null` means "there is no Provider". That's a mistake in our code.
  - The view being `null` means "the map isn't ready yet". That's normal, and it passes.
- In `App.tsx`, wrap `<MapProvider>` around the app shell: inside `<BrowserRouter>`, and above `Header`, `Sidebar`, and `MapArea`.

**Checkpoint:** the app still runs, and `MapContext.tsx` has no red underlines. In React Developer Tools, select `MapProvider`: its state is `null`.

### Step 3: Fill it, read it, and test the cleanup (about 10 min)

- In `MapArea`, the view moves out of local state and into the context.
  - Delete the ref from Step 1, the two `useState` lines, and the effect that logs to the console.
  - Get the setter from the context with `useSetMapView()`.
  - The map doesn't need a place of its own. It's always available as `view.map`.
- In the map's ready handler, hand the view to the context: `event.target.view` when `event.target.ready` is true, and `null` when it isn't.
- Add an effect that does nothing when it starts, and whose cleanup sets the view to `null`. The cleanup runs when `MapArea` leaves the page.
- In `Header`, read the view with `useMapView()`, and make the button work from there:
  - It's disabled while there is no view.
  - When clicked, it calls `view.goTo` with the same center and zoom as in Step 1.
- Now test the cleanup. In `App`, add a piece of state, `showMap`, that starts as `true`.
  - Put a button inside `<Header>` that flips it. It says "Hide map" or "Show map". `Header` already renders its `children`.
  - Render `<MapArea />` only while `showMap` is true.

**Checkpoint:** "Back to start" is greyed out while the map loads, then works. Click "Hide map": the button greys out again, because the cleanup set the view back to `null`. Click "Show map": a new map loads from the beginning, and the button comes back.

- That last part is the loading chain starting over. Anything the user did to the old map is gone.

## Part 2: The map takes over the layers

### Step 4: Retire Day 2's layers context (about 15 min)

- Yesterday the panel's layers came from the web map's document, loaded into `LayersProvider`. Today there's a live map on the page that already holds them. Two copies of one list is one too many.
- **Keep one thing from the Provider:** the selected layer stays in the URL, as `?layer=`.
  - Make a new file, `useSelectedLayerId.ts`, beside `App.tsx`. In it, write a custom Hook, `useSelectedLayerId`.
  - Move the `useSearchParams` lines into it from `LayersContext.tsx`. It returns the selected ID, and a function that selects a layer by its ID.
- **The list reads the map.** In `layers/LayerList.tsx`, get the view with `useMapView()`. The layers are `view.map.layers.toArray()`, or an empty list while there is no view.
  - Use `map.layers`, not `map.allLayers`, or the basemap's layers appear in the list too.
  - `key={layer.id}` still works. It's the same ID the web map's document gave the layer, so yesterday's `?layer=` links still select the right one.
- **Each row shows the layer's title and its kind.** The kind comes from `layer.type`, through a small lookup like Day 1's. Make a new file for it, `layers/layerKindNames.ts`:

| `layer.type` | Show |
|---|---|
| `feature` | Feature layer |
| `graphics` | Graphics layer |
| `map-image` | Map image layer |
| `tile` | Tile layer |
| `vector-tile` | Vector tile layer |
| `group` | Group layer |

- **"Show / hide" writes straight to the layer.** In `layers/LayerListItem.tsx`, replace the checkbox with a plain button that says "Show / hide". Give it `className="row-action"`.
  - When it's clicked, the list sets `layer.visible = !layer.visible`. There's no `useState` for it.
  - Why not a checkbox: a checkbox would have to show whether the layer is visible, and React can't see that yet. Step 7 comes back to this.
- **The details find the layer on the map.** In `layers/LayerDetails.tsx`, get the selected ID from `useSelectedLayerId()`, and look the layer up with `view.map.findLayerById(...)`.
  - Show the title, the kind, the address, and whether it's visible.
  - Only some kinds of layer have an address. Check `layer instanceof FeatureLayer` before reading `layer.url`. For any other kind, show "No address".
- **Then delete what's left of Day 2:**
  - `<LayersProvider>` in `App.tsx`, and the file `LayersContext.tsx`
  - `<VisibleCount />` in `App.tsx`, and the file `layers/VisibleCount.tsx`. A count of visible layers has the same problem as the checkbox.
  - `layers/layerTypeNames.ts` and `webMapLayers.ts`. Nothing reads them now.

**Checkpoint:** each of the map's layers is listed with its kind. "Show / hide" hides and shows it on the map. Click a layer's name: the URL gains `?layer=...`, and the details show that layer.

- What changed since Day 1: visibility was in `useState` then, because React was the only place it existed. Today the click changes the layer directly. The layer owns it.

### Step 5: Wait where it's needed (about 12 min)

Three waits, in the three places from this morning.

- **In state, from the map's event.** While there is no view, the layer list shows "Loading map…" instead of the list. The details can do the same.
- **In a handler.** Add a "Zoom to" button to each row, with `className="row-action"`. Nothing on screen changes while it waits, so the wait stays in the handler:
  - Write an `async` function, `zoomTo`, that takes a layer.
  - It waits for `layer.load()`. A layer doesn't know its extent until it has loaded.
  - Then, if the layer has a `fullExtent`, it calls `view.goTo` with it.
- **In state, from an effect.** First, break something. In the map's ready handler in `MapArea`, add a layer whose service doesn't exist to `event.target.map`: a `new FeatureLayer` with `url: MISSING_LAYER_URL` and `title: 'Zoning'`.
  - Look at the app. The map appears, and "Zoning" is in the list like any other layer. Nothing says it's broken.
- Fix it with the `useLayerLoaded` handout.
  - A Hook can't be called inside a loop, so it can't go in the list's `map`. It goes in the row's own component, `LayerListItem`.
  - Hand the row the whole `layer` as a prop, in place of its title and its type, and call `useLayerLoaded(layer)` there.
  - `'failed'`: show "Couldn't be loaded" where the kind was, and disable the row's two buttons.
  - `'loading'`: show "Loading…" where the kind was.
  - `'loaded'`: show the layer's kind, as before.
- The row doesn't change the layer itself, because props are read-only. It asks, through functions it's given as props, and the list does it. That's Day 1's callback props.

**Checkpoint:** "Zoom to" on Trails or Trailheads moves the map to that layer. The "Zoning" row says "Couldn't be loaded", and its buttons are greyed out. Every other row looks as it did.

- "Zoom to" on Parks and Open Space zooms out to most of the world. The code is right: that service reports an extent far bigger than its data. "Back to start" brings you back.
- The console shows errors about "Zoning" from the Maps SDK itself. That's expected: it's the SDK reporting the layer we broke on purpose.
- Why the other rows never say "Loading…": by the time this map is ready, its own layers have already loaded. The Hook earns its place on the layer that fails, and on the ones we add next.

## Part 3: Layers of our own

### Step 6: Add layers of our own (about 12 min)

So far every layer came from the web map, or was broken on purpose. Now our code adds two real ones. Put a button for each under the layer list, inside a `<div className="layer-actions">`.

- **"Add high trailheads":** a second copy of the trailheads, showing only the high ones.
  - Make a `new FeatureLayer` with `url: TRAILHEADS_URL`, `title: 'Trailheads above 1,000 ft'`, and `definitionExpression: 'ELEV_FT > 1000'`.
  - A layer is part of what the map *is*, so it goes on the **map**: `view.map.add(...)`.
- **"Drop a pin at the center":** a pin at the middle of the map.
  - The pins need a layer of their own: a `new GraphicsLayer` with `title: 'Pins'`. Make it once, outside the component, so every pin goes in the same layer. Add it to the map the first time it's needed.
  - *Where* to put the pin is where this user is looking right now, so it comes from the **view**: `view.center`.
  - The pin is a `new Graphic` with `geometry: view.center` and `symbol: { type: 'simple-marker', color: 'crimson', size: 12 }`. Add it to the pins layer.
- **Tell React.** Adding a layer changes the map's list in place, and React isn't told. So we tell it ourselves, with a piece of state that exists only to make the list render again:
  - `const [, setLayersAdded] = useState(0)`
  - After each `view.map.add(...)`, add one to it.
- Add one more line to the details: the layer's filter, `layer.definitionExpression`, or "None". Only a `FeatureLayer` has one, so it needs the same check as the address.

**Checkpoint:** "Add high trailheads" puts a new layer on the map and in the list, with its kind. Select it: the details show its filter, `ELEV_FT > 1000`. Pan the map and drop two pins: each lands where the map's center was at that moment.

- Which object did each line use?
  - `view.map.add(...)`: the map. A layer would be saved with the web map.
  - `view.center`: the view. It's where this user is looking, right now.
  - `definitionExpression`: the layer. It's part of what the layer is.
- Two kinds of layer: a `FeatureLayer` for data in a service, and a `GraphicsLayer` for things the app draws itself.

### Step 7: See the gap (about 5 min)

- In `Header`, add a label after the button that shows the map's zoom: `view.zoom`, to one decimal place.
- Zoom the map. The label doesn't change.
- Select a layer, then click its "Show / hide". The layer disappears from the map. The details still say it's visible.
- Why: the context hands out the view, but React still can't see inside it. Nothing told React that `view.zoom` or `layer.visible` changed.
- It's the same gap as Step 6. The list only noticed our new layers because we told it.
- This is where Day 4 starts.

## Wrap-up

- Where does each piece of state live now?

| Value | Lives in | Why |
|---|---|---|
| The view | A context | A live object, created once, needed in many places |
| The layers | The map | Day 2's `LayersProvider` is gone, because the map already had them |
| The selected layer | The URL | As it was yesterday |
| Whether a layer is visible | The layer itself | We never copied it into React |

- One component created the view: `MapArea`. Every other component borrowed it.
- Three days, three sources for one panel: a data file, a document, and now the map.

## Stretch goals

- Add Esri's own components to the map: `<arcgis-search slot="top-right" />`, and a basemap gallery inside `<arcgis-expand>`. Import each one first, as in this morning's Basic Lab.
- Show the web map's title in the header: `view.map.portalItem?.title`, with "Loading…" until the view exists
- List everything that failed to load, using the map's `arcgisLoadError` event, and show it as a notice above the layer list
- Give each pin a number, and list the pins in the sidebar with a "Zoom to" for each
- Add a second filtered layer with a filter of your own, using a field from the layer's page
- Use `useMapView()` in a component that's outside `<MapProvider>` on purpose, and read the error message
