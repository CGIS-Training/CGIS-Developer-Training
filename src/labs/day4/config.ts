// The values the labs need. They are ready to use: import the ones a step asks for.
// The first five are from Day 3, and the app still uses them. The rest are new for Day 4.

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

// ----- New for Day 4 -----

// The address of Esri's public Service Requests layer (Step 1). Anyone can edit it, without signing in.
export const REQUESTS_URL =
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0'

// An ID of our own, for the layer our code adds (Steps 1 and 2)
export const REQUESTS_LAYER_ID = 'service-requests'

// A filter for that layer (Step 1). Anyone can type anything into it, so we load only
// the requests whose status is one of the three real ones.
export const REQUESTS_FILTER = "status IN ('Unassigned', 'Assigned', 'Closed')"

// Where the requests are (Step 1): near Naperville, Illinois, as [longitude, latitude], and a zoom level
export const REQUESTS_CENTER: [number, number] = [-88.146, 41.77]
export const REQUESTS_ZOOM = 12

// The two fields the lab shows and edits (Steps 3 and 4)
export const NAME_FIELD = 'requesttype' // the kind of request, shown as its name
export const EDIT_FIELD = 'status' // the field we edit. It has a list of allowed values.
