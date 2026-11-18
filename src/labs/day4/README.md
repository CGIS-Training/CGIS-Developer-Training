# Day 4 Lab: A Layer of Our Own

Add a layer to the map in code, follow it from React, click one of its features to see it in a panel of our own, then change one of its values and save it.

- **Time:** about 45 minutes
- **You will use:** adding a layer in code, finding a layer by its ID, `useWatch`, a hit test, a Calcite dropdown, and `applyEdits`

| Step | What happens |
|---|---|
| 1. Add | Add a layer to the map in code, with an ID of our own |
| 2. Follow | Close yesterday's gap, then find the layer by its ID and follow it with a checkbox |
| 3. Select | Click a request on the map, and show it in the sidebar |
| 4. Edit | Change the request's status, and save it |

- Each step only needs the steps before it. If time runs out, stop after any step: what you have still works.

## From yesterday to today

- Yesterday's lab ended on a gap. The zoom label in the header didn't follow the map, and the details kept saying a hidden layer was visible.
- The reason: the map owns those values, and nothing told React when they changed.
- Today's question, for every value on the page: **who owns it?**
  - If the map owns it, React follows it. It doesn't keep a copy of its own.
  - If only our app knows about it, React owns it.

## Before you start

- Your code goes in this folder, `src/labs/day4`. It already works.
- To see it, open `src/main.tsx` and change the import line to `import App from './labs/day4/App'`.
- It starts as the finished Day 3 lab:
  - The map, and the map context: `useMapView()` gives any component the view.
  - The sidebar, with the layers panel and the details panel. Both read the map's own layers.
  - The header, with "Back to start", the zoom label that doesn't follow, and "Hide map".
  - The "Zoning" layer that fails to load on purpose, and the two buttons that add layers of our own.

| File | What it is |
|---|---|
| `layout/MapArea.tsx` | The map. Steps 1 and 3 add to it. |
| `layout/Header.tsx` | The header. Steps 1 and 2 add to it. |
| `App.tsx` | The app's top component. Steps 2, 3, and 4 add panels and state to it. |
| `useWatch.ts` | **Handout** for Step 2: the finished Hook from this morning. Give it an expression that reads a value the map owns, and it hands back the latest value. |
| `requests/StatusForm.tsx` | **Handout** for Step 4: a form with four gaps to fill in |
| `config.ts` | The values the steps ask for. See **The data**, below. |
| `app.css` | The styles. The top of the file lists two new class names for today. |

- `requests/StatusForm.tsx` has red underlines until you fill in its four gaps in Step 4. That's expected. Nothing uses the file before then, so the app still runs.
- Today's new files all go in the `requests` folder, beside the handout.

## The data

- A layer of service requests: potholes, broken street lights, stray animals. It's a public sample from Esri, around Naperville, Illinois.
- It isn't in our web map. In Step 1, our own code adds it.
- Each request has a **status**: Unassigned, Assigned, or Closed. That's the value we edit in Step 4.
- Anyone can edit this layer, without signing in. That's why it works for a lab, and it means three things:
  - **Everyone in the room edits the same layer.** Pick one request and stay with it, so you don't undo a neighbor's work.
  - **Anyone can type anything into it.** Step 1 gives the layer a filter, so only requests with a real status are loaded.
  - **Leave it as you found it.** When you finish Step 4, set your request back to the status it had.
- `config.ts` has everything the steps need:

| Value | What it is | Step |
|---|---|---|
| `REQUESTS_URL` | The address of the service requests layer | 1 |
| `REQUESTS_LAYER_ID` | An ID of our own, for the layer our code adds | 1 and 2 |
| `REQUESTS_FILTER` | A filter: only the requests whose status is one of the three real ones | 1 |
| `REQUESTS_CENTER`, `REQUESTS_ZOOM` | Where the requests are | 1 |
| `NAME_FIELD` | The field that holds the kind of request | 3 |
| `EDIT_FIELD` | The field we edit: the status | 3 and 4 |

## Step 1: Add the layer we'll edit (about 5 min)

Every layer in the list came with the web map, or was added by yesterday's buttons. This one is added as soon as the map is ready.

- Open `layout/MapArea.tsx`, and find the map's ready handler. Yesterday's "Zoning" layer is added there.
- After the "Zoning" lines, and **before** the line that calls `setView`, add the new layer to the map.
  - Make a `new FeatureLayer` with `id: REQUESTS_LAYER_ID`, `url: REQUESTS_URL`, `title: 'Service requests'`, `outFields: ['*']`, and `definitionExpression: REQUESTS_FILTER`.
  - Add it with `map.add(...)`.
  - **Add it once.** The ready handler can run again. Wrap the lines in an `if` that checks three things: `event.target.ready` is true, there is a `map`, and `map.findLayerById(REQUESTS_LAYER_ID)` finds nothing.
- What each line of the layer is for:
  - `id`: an ID of our own. Without one, the map makes up a new ID every time the app runs, and nothing could find the layer again.
  - `url`: where the layer's data is.
  - `outFields`: every field, so a clicked request arrives with all of its values. Step 3 needs them.
  - `definitionExpression`: the filter. Only matching requests are loaded.
- Why before `setView`: the other components look for the layer when the view arrives. If the layer is added afterwards, they have already looked.
- The requests are a long way from our web map, so give the header a way to get there. In `layout/Header.tsx`, add a second button after "Back to start": "Go to the requests".
  - It works like "Back to start", with `REQUESTS_CENTER` and `REQUESTS_ZOOM`.

**Checkpoint:** "Service requests" is in the layers panel, with the others. Click "Go to the requests": the map moves to Naperville, and there are dots on it. Red is Unassigned, orange is Assigned, and green is Closed. Nobody chose those colors. They came with the layer.

## Step 2: Follow the layer from React (about 10 min)

The layer is in the map. Now React needs to find it, and to know when it changes.

### Close yesterday's gap

- In `layout/Header.tsx`, the zoom label reads `view.zoom` once, and never again.
- Replace it with the handout: `useWatch(() => view?.zoom, [view])`. It hands back the zoom, and keeps it up to date.
- The value is `undefined` until the map is ready. Show "…" then, and the zoom to one decimal place after that.

**Checkpoint:** zoom the map, and the label in the header follows. That's yesterday's Step 7, fixed with one line.

### Find the layer by its ID

- Three components will need this layer, so the lookup gets a file of its own. In the `requests` folder, make a new file, `findRequestsLayer.ts`.
- In it, write a function, `findRequestsLayer`. It takes the view, which may be `null`.
  - It looks the layer up with `view?.map?.findLayerById(REQUESTS_LAYER_ID)`.
  - It returns the layer when `layer instanceof FeatureLayer` is true, and `undefined` when it isn't.
- Finding it by ID works because the ID is ours. We chose it in Step 1, so it's the same every time the app runs.
- The check on `FeatureLayer` tells TypeScript which kind of layer this is. Step 4 needs that.

### A checkbox that follows the layer

- In the `requests` folder, make a new component, `RequestsToggle.tsx`: a checkbox that shows and hides the requests.
- Get the view with `useMapView()`.
- Get the layer's visibility with the handout: `useWatch(() => findRequestsLayer(view)?.visible, [view])`.
  - **There is no `useState` for "visible".** The layer owns it. React follows.
- While the value is `undefined`, the layer isn't there yet. Show a message, "Loading the requests…", with `className="empty"`.
- After that, show a `<label className="request-toggle">` with a checkbox inside it, and some words. The checkbox's `checked` is the value from `useWatch`.
- When the checkbox changes, find the layer with `findRequestsLayer(view)`, and set its `visible` to `event.target.checked`. That's all the handler does.
- In `App.tsx`, add a new panel at the top of the sidebar, `<Panel title="Requests">`, with `<RequestsToggle />` inside it.

**Checkpoint:** untick the box, and the dots disappear. Tick it, and they come back.

**Checkpoint:** now change the layer from somewhere else. In the layers panel, click "Show / hide" on the "Service requests" row. The dots disappear, **and our checkbox clears by itself.**

- Nothing in `RequestsToggle` ran when you clicked that button. The layer changed, and told React.
- Yesterday's button and today's checkbox don't know about each other. They don't need to. They both write to the layer, and the layer is the one place the value lives.
- One writer in each direction: the handler writes to the layer, and `useWatch` writes to React.

## Step 3: Click a request, and show it in our own panel (about 15 min)

So far a click on the map opens Esri's popup. We want the clicked request in our sidebar, so we turn the popup off and ask the map ourselves.

- **Who owns "the selected request"? React.** The map has no idea what we consider selected.
- Two parts of the page need it, the map and the sidebar, so it lives in the component that holds both. In `App.tsx`, add a piece of state, `selected`. It holds a `Graphic` or `null`, and it starts as `null`.
- `MapArea` needs a way to say what was clicked. Give it a prop, `onSelect`: a function that takes a `Graphic` or `null`. In `App.tsx`, pass it `setSelected`.
- In `layout/MapArea.tsx`, on `<arcgis-map>`:
  - Add `popupDisabled`. Esri's popup no longer opens.
  - Add `onarcgisViewClick`, with an `async` handler. A click is only a place. A **hit test** asks the map what is drawn there.
- In the handler:
  - Find the layer with `findRequestsLayer(event.target.view)`. If there isn't one, stop.
  - Wait for `event.target.hitTest(event.detail, { include: [layer] })`.
  - Take the first of the response's `results`.
  - Call `onSelect` with that result's `graphic` when its `type` is `'graphic'`, and with `null` when it isn't.
- `include: [layer]` limits the answer to our layer. Step 3's last line shows what happens without it.
- Nothing under the click gives `null`, so clicking empty map clears the selection.

**Checkpoint:** nothing looks different yet. In React Developer Tools, select `App`: its state changes from `null` to a Graphic when you click a request, and back to `null` when you click empty map. The popup no longer opens.

- Now show it. In the `requests` folder, make a new component, `RequestDetails.tsx`. It takes one prop, `feature`: a `Graphic` or `null`.
  - With no feature, it shows "Select a request", with `className="empty"`.
  - With one, it shows two lines in a `<dl className="layer-details">`, like yesterday's details: the type, `feature.attributes[NAME_FIELD]`, and the status, `feature.attributes[EDIT_FIELD]`.
- In `App.tsx`, add a panel under "Requests": `<Panel title="Selected request">`, with `<RequestDetails feature={selected} />` inside it.

**Checkpoint:** click a request, and its type and status appear in the sidebar. Click another, and they change. Click empty map, and the panel goes back to "Select a request".

- The values are there because Step 1 asked the layer for every field. Without `outFields`, both would be blank.
- Try it: take `{ include: [layer] }` out of the hit test, and click a road. The panel shows two blank lines, because a piece of the basemap was "selected". Put it back.

## Step 4: Change the status, and save it (about 15 min)

- Open the handout, `requests/StatusForm.tsx`, and fill in the four TODOs.
  - **TODO 1, the draft.** What the user has picked and not yet saved is React's, so it's state. Make `draft` and `setDraft` with `useState`, starting as `saved`.
  - **TODO 2, the choices.** They come from the layer, not from a list typed into our code. Ask for the field's list with `layer.getFieldDomain(EDIT_FIELD)`. `choices` is that list's `codedValues` when its `type` is `'coded-value'`, and an empty list when it isn't.
  - **TODO 3, the edit.** It's a `new Graphic` whose `attributes` hold two things: which request, and what changed.
    - Which request: `[layer.objectIdField]`, set to `feature.getObjectId()`.
    - What changed: `[EDIT_FIELD]`, set to `code`.
    - Send it, and wait for the answer: `await layer.applyEdits({ updateFeatures: [edit] })`.
  - **TODO 4, the check.** A save can fail without an error being thrown, so read the answer: `result.updateFeatureResults[0]?.error`. If there's an error, set the save's state to `'failed'`. If not, call `onSaved()`.
- The red underlines in the handout are gone.
- The form goes in the details, under the two lines. In `requests/RequestDetails.tsx`:
  - Add a second prop, `onSaved`: a function that takes nothing.
  - Get the view with `useMapView()`, and the layer with `findRequestsLayer(view)`.
  - Under the `<dl>`, when there is a layer, show `<StatusForm>`. Give it the `feature`, the `layer`, and `onSaved`.
  - Give it one more thing: `key={feature.getObjectId()}`. The key gives each request its own form. Select another request, and the draft starts over.

**Checkpoint:** select a request. The dropdown shows its status. Pick another status: the Save button wakes up, and nothing on the map changes, because only the draft changed. Select a different request: the dropdown shows that request's status.

- A successful save makes the form go away, so "Saved" is `App`'s to show. In `App.tsx`:
  - Add a piece of state, `justSaved`, that starts as `false`.
  - Give `<RequestDetails>` an `onSaved` that sets `selected` to `null`, and `justSaved` to `true`. The request we're holding is a copy from before the save, so we let it go.
  - Change `MapArea`'s `onSelect`: it sets `selected` to the feature, and `justSaved` to `false`.
  - In the "Selected request" panel, above `<RequestDetails>`, show a notice while `justSaved` is true: a `<calcite-notice open kind="success">` with `<div slot="message">Saved</div>` inside it.
  - Import the notice at the top of the file: `import '@esri/calcite-components/components/calcite-notice'`.

**Checkpoint:** select a request, pick a different status, and click Save. The panel says "Saved", and the dot on the map changes color. Click the same request again: it has the new status, and the dropdown agrees.

- Saving is a wait, with the same states as every other wait this week:
  - Saving: the button is busy, and can't be pressed twice.
  - Saved: the form closes, and the panel says so.
  - Failed: the form stays, with the draft still in it.
- Try it: open the Network tab, and save again. Find the `applyEdits` request, and read its answer: one result for the one request we sent.
- When you're done, set your request back to the status it had.

## Wrap-up

- Who owns each value?

| Value | Owner | How the other side finds out |
|---|---|---|
| The zoom | The view | React follows it with `useWatch` |
| Whether the requests are visible | The layer | React follows it with `useWatch` |
| The selected request | React state | The map isn't told |
| The status being edited | React state, until it's saved | `applyEdits` sends it |
| The saved status | The service | The map redraws, and we select the request again |

- Nothing in this table is kept in two places for longer than it takes to save.
- Deciding the owner first is what kept each step short.

## Stretch goals

- Close the other half of yesterday's gap. In `layers/LayerDetails.tsx`, the "Visible" line doesn't follow the layer. Follow it with `useWatch`.
- A slider for the requests' opacity. It's Step 2's checkbox again, with `layer.opacity` in place of `layer.visible`.
- Show the selection on the map. Get the layer's view with `view.whenLayerView(layer)`, and call its `highlight` with the selected request. `highlight` hands back a handle: remove it in an effect's cleanup, or old highlights stay on the map.
- Show the layer's own popup content in the panel, with `<arcgis-feature graphic={selected} />`. Import the component first.
- Add a Cancel button to the form that puts the draft back to the saved value.
- Keep the panel open after a save: ask the layer for the request again by its ID, and select the fresh copy.
- Break a save on purpose. Set `layer.editingEnabled = false` before saving, and read what happens. Then put it back.
