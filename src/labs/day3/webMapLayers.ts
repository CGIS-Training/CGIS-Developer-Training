// A copy of the layer list from a web map, in the shape ArcGIS stores it.
// Every web map is saved as a document; its `operationalLayers` list has one entry per layer.

export type WebMapLayer = {
  id: string
  title: string
  layerType: string // 'ArcGISFeatureLayer', 'ArcGISMapServiceLayer', ...
  url?: string
  visibility?: boolean // left out means visible
  opacity?: number // left out means 1 (fully opaque)
}

export const webMapLayers: WebMapLayer[] = [
  {
    id: '18f3a2b7c9d-layer-2',
    title: 'Parcels',
    layerType: 'ArcGISFeatureLayer',
    url: 'https://services.example.com/arcgis/rest/services/Parcels/FeatureServer/0',
    visibility: true,
    opacity: 0.8,
  },
  {
    // No visibility and no opacity, as real web maps often leave them out
    id: '18f3a2b7c9d-layer-3',
    title: 'Roads',
    layerType: 'ArcGISFeatureLayer',
    url: 'https://services.example.com/arcgis/rest/services/Roads/FeatureServer/0',
  },
  {
    id: '18f3a2b7c9d-layer-4',
    title: 'Zoning',
    layerType: 'ArcGISMapServiceLayer',
    url: 'https://services.example.com/arcgis/rest/services/Zoning/MapServer',
    visibility: true,
    opacity: 0.6,
  },
]
