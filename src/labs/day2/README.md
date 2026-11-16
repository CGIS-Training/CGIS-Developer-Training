# Day 2 Lab: A Layers Context

Move the layers out of the component that holds them and into a context, read them anywhere with one Hook, then fill the context from a real web map.

- **Time:** about 75 minutes
- **You will use:** a custom Hook, Context, an effect with a cleanup, typing and checking data from a service, and state in the URL

## The problem we're solving

- On Day 1, one component held the layers, and handed them down as props to the list and the details.
- Every new component that needs the layers means another prop, passed through every component in between.
- A context holds the layers once. Any component inside it can ask for them.

## Before you start

- Your code goes in this folder, `src/labs/day2`. It starts as the finished Day 1 lab, so it already works.
- To see it, open `src/main.tsx` and change the import line to `import App from './labs/day2/App'`.
- `App.tsx` has one new thing: a `<BrowserRouter>` around the whole app. Step 6 needs it. Leave it as the outermost element.
- `config.ts` is new. It has the two values that say which web map to load: `PORTAL_URL` and `WEB_MAP_ID`.

## The data

- Today the layers come from a real web map. It's public, so there is no sign-in. Day 5 covers signing in.
- Every web map is saved as a document. One address returns it:

  ```
  {PORTAL_URL}/sharing/rest/content/items/{WEB_MAP_ID}/data?f=json
  ```

- Its `operationalLayers` list has one entry for each layer: `id`, `title`, `layerType`, `url`, `visibility`, `opacity`.
- That's the shape of the `WebMapLayer` type from Day 1, so the type is reused as it is.
- `visibility` and `opacity` are often left out. Left out means visible, and fully opaque.

## Steps

### Step 1: Create the context and its Provider (about 12 min)

- Make a new file, `LayersContext.tsx`, beside `App.tsx`.
- Copy the layers state, the selected ID, and `toggleLayer` into it from `App`. Leave `App` as it is for now.
- The file needs two things:
  - A context, made with `createContext`. Its value is the object below, or `null`. `null` means "there is no Provider above this component".
  - A `LayersProvider` component. It holds the state, and renders its `children` inside the context's Provider.

| In the context's value | What it is |
|---|---|
| `layers` | The list of layers |
| `selectedLayer` | The selected layer, or `undefined` when nothing is selected |
| `toggleLayer` | A function that takes a layer's ID, and shows or hides that layer |
| `selectLayer` | A function that takes a layer's ID, and selects that layer |

- Wrap the app in `<LayersProvider>`: inside `<BrowserRouter>`, and around everything else that `App` returns.
- The Provider is an ordinary component. It has state, and it renders its `children`.

**Checkpoint:** the app works as before. In React Developer Tools, find `LayersProvider` and see the layers in its state.

### Step 2: Write the Hook that reads it (about 8 min)

- In the same file, write a custom Hook, `useLayers`. It reads the context and returns its value.
- If there is no Provider above the component, it throws an error with a clear message.
  - Why: a component outside the Provider is a mistake in our code. A clear message now beats a confusing one later.
- After that check, TypeScript knows the value isn't `null`. No component that calls `useLayers()` has to check again.

**Checkpoint:** in `Header`, add `const { layers } = useLayers()` and log `layers.length`. It logs the number of layers in the data file, and nothing was passed to `Header`. Then take the two lines out.

### Step 3: Read from the context, and delete the props (about 12 min)

- The list, the details, and the count each ask the context for what they need, with `useLayers()`.
- `LayerDetails` takes `selectedLayer`. The rest of it is unchanged.
- `LayerList` takes `layers`, `selectedLayer`, `toggleLayer`, and `selectLayer`. A row is selected when its layer is the selected layer.
- `VisibleCount` takes `layers`.
- Then delete: the props on those components, their props types, and all the layers state in `App`.

**Checkpoint:** everything works as before. `App` has no state and no functions left. It only arranges the page.

### Step 4: Load the layers from the web map (about 18 min)

- The Provider's layers now start empty, and an effect fills them from the address in **The data**, above.
- This is the fetch from this morning (Fetching Data in an Effect): an `async` function inside the effect, and an `ignore` flag set by the cleanup.
- Think about the effect's dependency list. Does the effect use anything that can change?
- Only the Provider changes in this step. No component that calls `useLayers()` is touched.

**Checkpoint:** the panel lists the web map's real layers. In the Network tab, the request appears twice. That's Strict Mode: start, stop, start.

### Step 5: Don't trust the answer (about 10 min)

- In `config.ts`, change the last character of `WEB_MAP_ID`, so the ID doesn't exist. The page goes blank, and the console shows an error.
- Why: when a web map doesn't exist, or isn't shared, the service still answers "success". The answer is an `error` object, with no `operationalLayers` in it. We put `undefined` in state as if it were a list.
- Check the answer before using it. Write a function, `readLayers`, that takes the answer as `unknown`. It returns the list of layers, or `null` when the answer isn't an object with an `operationalLayers` list.
- Add a status to the Provider, and to the context's value: `'loading'`, `'ready'`, or `'failed'`.
- A request can also fail outright, for example with no network. That's `'failed'` too.
- In `LayerList`, show "Loading layers…" and "Couldn't load the layers." before the list.

**Checkpoint:** with the wrong ID, the panel says "Couldn't load the layers." and the rest of the page still works. Put the right ID back.

### Step 6: Put the selected layer in the URL (about 10 min)

- In the Provider, the selected ID stops being state. Read it from the address bar with `useSearchParams`, from `react-router`. Name the search parameter `layer`.
- `selectLayer` now sets that search parameter.
- Delete the `useState` for the selected ID. The URL is the state now.
- Again, only the Provider changes. The list and the details still call `useLayers()` and get the same things.
- An ID in the URL that isn't in the web map selects nothing, and the details show "Select a layer". That's the lookup from Day 1 doing its job.

**Checkpoint:** select a layer, copy the URL into a new tab, and the same layer is selected there.

## Wrap-up

- Where does each piece of state live now, and why? Think about the layers, the selected layer, and whether a layer is visible.
- The place the data comes from changed three times. How many times did the components that show it change?
- Tomorrow the map gets a context of its own, built the same way.

## Stretch goals

- Call `useLayers()` in a component that's outside `<LayersProvider>` on purpose, and read the error message
- Use Esri's own request helper instead of `fetch`: `request` from `@esri/arcgis-rest-request`, which is already in the project. It turns the "success, but an error" answer into a thrown error.
- Show the web map's title in the header. The same address without `/data` returns the item's details, including `title`.
- A "Reload" button in the layers panel that asks the service again
- Check each layer, not only the list: a Zod schema for `WebMapLayer`, used inside `readLayers`. Install it first with `npm install zod`.
- Cancel the request in the cleanup with `AbortController`, instead of ignoring its answer
