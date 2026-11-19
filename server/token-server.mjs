// The Day 5 lab's token server, for Part 3. It runs in Node, never in the browser.
// It holds the client secret, and hands the React app a token that expires.
// In production this would be a small function in the cloud (Backend and Security: App Authentication Behind a Lambda).
//
// Start it from the project folder, in a second terminal:
//   node --env-file=server/.env.local server/token-server.mjs
import { createServer } from 'node:http'
import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request'

// The server's own settings, from server/.env.local. Vite never reads that file, so none of it reaches the browser.
const { PORTAL_URL, ARCGIS_CLIENT_ID, ARCGIS_CLIENT_SECRET } = process.env
const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:5173'
const PORT = Number(process.env.PORT) || 3001

for (const [name, value] of Object.entries({ PORTAL_URL, ARCGIS_CLIENT_ID, ARCGIS_CLIENT_SECRET })) {
  if (!value) {
    console.error(`Missing ${name}. Check server/.env.local.`)
    process.exit(1)
  }
}

const portal = `${PORTAL_URL.replace(/\/+$/, '')}/sharing/rest`

// Created once, then reused. It fetches a token and renews it when it expires.
const manager = ApplicationCredentialsManager.fromCredentials({
  clientId: ARCGIS_CLIENT_ID,
  clientSecret: ARCGIS_CLIENT_SECRET,
  portal,
})

createServer(async (request, response) => {
  // Only our app's address may call this from a browser
  response.setHeader('Access-Control-Allow-Origin', APP_ORIGIN)
  response.setHeader('Content-Type', 'application/json')

  try {
    const token = await manager.getToken(portal)
    response.end(JSON.stringify({ token }))
    console.log('Handed out a token')
  } catch (error) {
    response.statusCode = 500
    response.end(JSON.stringify({ error: 'Could not get a token' }))
    // The reason stays here, in the terminal. The browser is told only that it failed.
    console.error('The portal refused:', error instanceof Error ? error.message : error)
  }
}).listen(PORT, () => {
  console.log(`Token server on http://localhost:${PORT}, for the app at ${APP_ORIGIN}`)
})
