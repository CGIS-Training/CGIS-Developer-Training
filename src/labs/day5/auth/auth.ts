// The lab's handout. This is the one file that changes from part to part: each part fills in one branch.
// Nothing in the map code knows which branch ran.
//
// Two of the imports below are underlined until Parts 2 and 3 use them. That's expected.
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
      // TODO Part 1: give the SDK the API key, and say which addresses it may go to
      break

    case 'user':
      // TODO Part 2: tell the SDK which app registration to sign in with
      break

    case 'app': {
      // TODO Part 3: ask our token server for a token, and give it to the SDK
      break
    }
  }
}
