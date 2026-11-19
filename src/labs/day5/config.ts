// The lab's settings, read from the .env.development file in one place (Configuration: One Config Module).
// Nothing here is secret: every value is copied into the JavaScript the browser downloads.

const AUTH_MODES = ['none', 'apiKey', 'user', 'app'] as const
export type AuthMode = (typeof AUTH_MODES)[number]

// Esri's public trailheads layer, the one used all week. It's shared with everyone, so it loads in every part.
export const PUBLIC_LAYER_URL =
  'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0'

// Where the map starts: the middle of the trailheads, as [longitude, latitude], and a zoom level
export const MAP_CENTER: [number, number] = [-118.805, 34.027]
export const MAP_ZOOM = 11

function read(name: string): string {
  const value: unknown = import.meta.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

// "apikey" and "apiKey" are the same choice
const requestedMode = read('VITE_AUTH_MODE') || 'none'
const authMode = AUTH_MODES.find((mode) => mode.toLowerCase() === requestedMode.toLowerCase())

const privateLayerUrl = read('VITE_PRIVATE_LAYER_URL')

// With or without a slash on the end, it's the same portal
const portalUrl = (read('VITE_PORTAL_URL') || 'https://www.arcgis.com').replace(/\/+$/, '')

export const config = {
  // Which part of the lab is running
  authMode: authMode ?? 'none',
  portalUrl,
  privateLayerUrl,
  // The server the private layer is on: the first part of its address. Part 1 needs it.
  privateLayerServer: URL.canParse(privateLayerUrl) ? new URL(privateLayerUrl).origin : portalUrl,
  apiKey: read('VITE_ARCGIS_API_KEY'),
  clientId: read('VITE_ARCGIS_CLIENT_ID'),
  tokenUrl: read('VITE_TOKEN_URL') || 'http://localhost:3001',
}

/**
 * Stops with a message that says what to fix, when a value the current part needs is missing or mistyped.
 * It's a function, and not a check at the top of the file, so a mistake shows on the page.
 */
export function checkConfig() {
  if (!authMode) {
    throw new Error(`VITE_AUTH_MODE is "${requestedMode}". It has to be one of: ${AUTH_MODES.join(', ')}.`)
  }
  if (!URL.canParse(config.portalUrl)) {
    throw new Error(`VITE_PORTAL_URL is "${config.portalUrl}", which isn't a full address. It starts with https://`)
  }
  if (config.privateLayerUrl && !URL.canParse(config.privateLayerUrl)) {
    throw new Error('VITE_PRIVATE_LAYER_URL isn’t a full address. It starts with https://')
  }
  if (config.authMode === 'apiKey' && !config.apiKey) {
    throw new Error('Missing VITE_ARCGIS_API_KEY. Check your .env.development file.')
  }
  if (config.authMode === 'user' && !config.clientId) {
    throw new Error('Missing VITE_ARCGIS_CLIENT_ID. Check your .env.development file.')
  }
}
