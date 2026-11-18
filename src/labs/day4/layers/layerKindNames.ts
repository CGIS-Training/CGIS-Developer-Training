// Step 4: a friendly name for each kind of layer, by its `type`. The same idea as Day 1's lookup,
// which used the names a web map's document gives its layers.
const LAYER_KIND_NAMES: Record<string, string> = {
  feature: 'Feature layer',
  graphics: 'Graphics layer',
  'map-image': 'Map image layer',
  tile: 'Tile layer',
  'vector-tile': 'Vector tile layer',
  group: 'Group layer',
}

/** A friendly name for a layer's kind, or the type itself if we haven't listed it. */
export function layerKindName(type: string) {
  return LAYER_KIND_NAMES[type] ?? type
}
