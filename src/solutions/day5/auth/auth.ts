// The lab's handout, with its three branches filled in.
// This is the one file that changes from part to part. Nothing in the map code knows which branch ran.
import esriConfig from '@arcgis/core/config'
import identityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import { checkConfig, config } from '../config'

/** Runs once, before the map loads. */
export async function setUpAuth() {
  checkConfig()

  // Which portal? Until it's told, the SDK assumes ArcGIS Online.
  esriConfig.portalUrl = config.portalUrl

  switch (config.authMode) {
    case 'none':
      // Part 0: nothing to set up
      break

    case 'apiKey':
      // Part 1: give the SDK the API key, and say which addresses it may go to
      if (new URL(config.portalUrl).hostname.endsWith('arcgis.com')) {
        // ArcGIS Online has one setting for it
        esriConfig.apiKey = config.apiKey
      } else {
        // ArcGIS Enterprise: the key, and the two addresses it goes to. The portal, and the private layer's server.
        esriConfig.apiKeys.scopes = [{ token: config.apiKey, urls: [config.portalUrl, config.privateLayerServer] }]
      }
      break

    case 'user':
      // Part 2: tell the SDK which app registration to sign in with
      identityManager.registerOAuthInfos([
        new OAuthInfo({
          appId: config.clientId,
          portalUrl: config.portalUrl,
          popup: false, // sign in on the portal's page, then come back
        }),
      ])
      break

    case 'app': {
      // Part 3: ask our token server for a token, and give it to the SDK
      const { token } = await fetch(config.tokenUrl).then((response) => response.json())
      if (!token) throw new Error('The token server answered, but without a token. Look at its terminal for the reason.')
      identityManager.registerToken({ server: `${config.portalUrl}/sharing/rest`, token })
      break
    }
  }
}
