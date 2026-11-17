// The values the Day 3 lab needs. They are ready to use: import the ones a step asks for.

// The portal the web map is saved in
export const PORTAL_URL = 'https://www.arcgis.com'

// Esri's public "LA Parks and Trails" web map. No login needed.
export const WEB_MAP_ID = '237b9584339446a0b56317b5962a4971'

// Where "Back to start" goes (Step 1): the middle of the map, as [longitude, latitude], and a zoom level
export const MAP_CENTER: [number, number] = [-118.805, 34.027]
export const MAP_ZOOM = 11

// A service that doesn't exist (Step 5). It stands in for a layer that isn't shared with us, or was deleted.
export const MISSING_LAYER_URL =
  'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/CGIS_Training_Missing_Layer/FeatureServer/0'

// The address of the Trailheads layer (Step 6)
export const TRAILHEADS_URL =
  'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0'
