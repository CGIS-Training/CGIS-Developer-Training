# Day 1 Lab: A Layers Panel

Build the app shell for City Viewer, and a layers panel like the one in Map Viewer, from a data file.

- **Time:** about 60 minutes, in three parts through the day
- **You will use:** components, typed props, `children`, lists and keys, conditional rendering, `useState`, events, and lifting state
- There is no map today. The panel is built and working before the map arrives on Day 3.

| Part | Steps | When |
|---|---|---|
| 1 | 1 and 2 | After components, props, and children |
| 2 | 3 and 4 | After conditional rendering and lists |
| 3 | 5 and 6 | After state and events |

## Before you start

- Your code goes in this folder, `src/labs/day1`. It starts with `App.tsx`, an empty component.
- The styles are already written, in `app.css`. The top of that file lists the class names to use. The outermost element of the app needs `className="app"`.
- The finished lab arrives tomorrow, in `src/solutions/day1`. If you use the file names below, you can compare each of your files with the finished one.

| File | What it is |
|---|---|
| `layout/Header.tsx` | The bar across the top |
| `layout/Sidebar.tsx` | The column on the left |
| `layout/MapArea.tsx` | The space for the map |
| `layout/Panel.tsx` | Optional: a section of the sidebar, with a heading |
| `layers/LayerListItem.tsx` | One row of the list |
| `layers/LayerList.tsx` | The list of rows |
| `layers/LayerDetails.tsx` | The details of the selected layer |

## The data

- The layers come from a data file, `webMapLayers.ts`. It's in this folder already.
- It's a copy of the layer list from a web map, in the shape ArcGIS stores it.
  - Every web map is saved as a document. Its `operationalLayers` list has one entry for each layer in the map.
  - The real thing is at `.../sharing/rest/content/items/{web map item ID}/data?f=json`
  - The data file stands in for that address for one day. Tomorrow's lab loads the layers from it.
- The file has the `WebMapLayer` type at the top, and the list of layers under it. Read both before Step 3.
- `visibility` and `opacity` are optional. Real web maps often leave them out, and one entry in the file does too.

## Steps

### Step 1: Build the app shell (about 10 min)

- Write three layout components: `Header`, `Sidebar`, and `MapArea`.
- `MapArea` is a grey box that says "Map goes here" until Day 3.
- The shell takes its content as `children`, so it doesn't need to know what goes inside it.

**Checkpoint:** a header across the top, a sidebar on the left, and the placeholder filling the rest.

### Step 2: Build one layer row (about 10 min)

- Write a `LayerListItem` component with typed props: the layer's title and its type.
- Show a friendly name for the type: "Feature layer" instead of `ArcGISFeatureLayer`.
- Render one row by hand, with made-up values, before you touch the data file.

**Checkpoint:** one row in the sidebar.

### Step 3: Render the list (about 8 min)

- Import `webMapLayers`, and render a row for each layer in it.
- Each row needs a `key`. The web map gives every layer an ID.
- Don't use the array position as the key. Layers get reordered.

**Checkpoint:** every layer in the data file is listed, and the console has no key warning.

### Step 4: Handle empty and missing data (about 5 min)

- An empty list: show "This map has no layers" instead of a blank sidebar. Test it by passing `[]`.
- A missing `visibility`: treat it as visible.
- A missing title: show "Untitled layer".

**Checkpoint:** the list still renders correctly for the entry with no `visibility`.

### Step 5: Show and hide a layer (about 12 min)

- Keep the list of layers in state, in the component that renders the list. It starts from the data file.
- Add a checkbox to each row. Its `checked` value comes from the layer. Its `onChange` asks the component that holds the layers to flip that layer.
- Replace, don't mutate: build a new array, with a new object for the layer that changed.

**Checkpoint:** each checkbox turns on and off by itself, without affecting the others.

### Step 6: Select a layer and show its details (about 12 min)

- Clicking a row selects it. A `LayerDetails` component shows that layer's title, type, address, and opacity.
- The list and the details both need to know which layer is selected, so that state moves up to the component that contains both. This is lifting state.
- The details read the layers too, so the list of layers from Step 5 moves up with it.
- Keep the selected layer's **ID** in state, not a copy of the layer. Find the layer from the ID during render.
- With nothing selected, the details say "Select a layer".

**Checkpoint:** select a layer, then turn it off. The details show the change, because they read the same data.

## Wrap-up

- Where does each piece of state live, and why?
- Count what the top component now passes down as props. Tomorrow's lab removes those props.
- Today React owns the layers, because there's no map. On Day 3 the real map takes over, and we'll decide again who owns what.

## Stretch goals

- An opacity slider in the details (`<input type="range">`), updating the same state as the checkbox
- A count above the list: "3 of 5 visible". Work it out during render. It doesn't need its own state.
- A text box that filters the list by title
- Highlight the selected row
- Replace the checkbox and the panel with Calcite components. Day 4 covers these properly.
