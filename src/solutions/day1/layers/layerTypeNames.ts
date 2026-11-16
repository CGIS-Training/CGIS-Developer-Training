const LAYER_TYPE_NAMES: Record<string, string> = {
  ArcGISFeatureLayer: 'Feature layer',
  ArcGISMapServiceLayer: 'Map image layer',
  ArcGISTiledMapServiceLayer: 'Tile layer',
}

/** A friendly name for a web map layer type, or the type itself if we haven't listed it. */
export function layerTypeName(layerType: string) {
  return LAYER_TYPE_NAMES[layerType] ?? layerType
}
