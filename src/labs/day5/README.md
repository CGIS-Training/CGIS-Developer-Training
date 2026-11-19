# Day 5 Lab: Four Ways to Reach a Private Layer

Load the same private layer four different ways: with no sign-in, with an API key, by signing in as yourself, and with the app signing in as itself. By the end you'll know which way to choose for a real project.

- **Time:** about 85 minutes
- **You will use:** `esriConfig`, the identity manager, an app registration, a `.env` file, and the Context pattern from Day 3

| Part | What happens | Who the portal sees |
|---|---|---|
| 0. No sign-in | Load a public layer, and watch the private one be refused | ? |
| 1. API key | Give the app a key that can reach one layer | ? |
| 2. User authentication | Sign in as yourself, on the portal's own page | ? |
| 3. App authentication | A small server holds a secret, and hands the app a token | ? |
| 4. Choosing | Three questions that pick the right method | |

- One question, asked after every part: **who does the portal think is making this request?** Fill in the last column as we go.

## This lab is a walkthrough

- The other labs gave you a working app, and steps to do at your own pace. This one we do **together**: your instructor does each step on screen, and you do it with them.
- That's because half of each part happens in the portal, not in code. Some of it only your instructor can do, and they'll hand you the result.
- Every part has the same five beats:
  1. **Set up in the portal**
  2. **Wire it in:** one change in the app
  3. **Observe:** the map, the layer list, the "The portal sees" label, and the browser's Network tab
  4. **Break it on purpose,** and read the error
  5. **When to choose it:** fill in one column of the table below

## Before you start

- Your code goes in this folder, `src/labs/day5`. It already works.
- It doesn't build on the earlier labs. It's a small app of its own, so nothing from Days 1 to 4 can get in its way.
- To see it, open `src/main.tsx` and change the import line to `import App from './labs/day5/App'`.

### Make your settings file

The lab reads its settings from a file named `.env.development`, at the top level of the project. You make it from the example.

1. In the Explorer, click `package.json` once. This makes the new file land beside it.
2. Click the **New File** icon at the top of the Explorer, type `.env.development`, and press **Enter**.
3. Open `.env.example`, which is also at the top level. Select everything in it, and copy it.
4. Paste it into your new `.env.development`.
5. Fill in the two values from your instructor: `VITE_PORTAL_URL` and `VITE_PRIVATE_LAYER_URL`.
6. In the terminal, stop the app with **Ctrl + C**, and start it again with `npm run dev`.

- **Every time you change `.env.development`, stop the app and start it again.** The values are read when the app starts.
- Nothing in this file is secret. Everything in it is copied into the JavaScript the browser downloads.

**Checkpoint:** the page says "Four Ways to Reach a Private Layer". The header says "Part 0: no sign-in", and "The portal sees: Nobody".

### Your app's address

Two parts of the lab ask for your app's address. It's whatever is in your browser's address bar when the app is showing, up to the first single slash.

- On your own computer: `http://localhost:5173`
- In a codespace: a longer address that ends in `app.github.dev`

### The files

| File | What it is |
|---|---|
| `auth/auth.ts` | **Where you work.** One function, `setUpAuth()`, with an empty branch for each part. |
| `auth/SignInButtons.tsx` | **Where you work,** in Part 2: the "Sign in" and "Sign out" buttons |
| `App.tsx` | Where the app starts. It waits for `setUpAuth()`, then shows the header and the page. |
| `config.ts` | Reads `.env.development` in one place, and checks it. The rest of the app imports `config`. |
| `auth/AuthContext.tsx` | Who is signed in, for Part 2. The same shape as the map context from Day 3. `useAuth()` reads it. |
| `auth/SignedInAs.tsx` | The label in the header: "The portal sees: …" |
| `map/LabMap.tsx` | The map. It's the same in every part, and knows nothing about sign-in. |
| `map/LayerStatus.tsx` | The list beside the map. For each layer it says "Loaded", or "Not loaded" and the reason. |
| `pages/MapPage.tsx`, `pages/AccountPage.tsx` | The two pages. Anyone can open the map. Only a signed-in user can open "My account". |
| `navigation/` | The list of pages and who may open each, the header's links, and the guard around a page |

- `auth/auth.ts` has two imports that are underlined until Parts 2 and 3 use them. That's expected.
- If a setting is missing or mistyped, the page tells you which one.

## The data

- **Trailheads:** the public layer we've used all week. It's shared with everyone.
- **The private layer:** a layer on the class portal that is **not** shared with everyone. Its sharing is Owner, plus a group the whole class belongs to.
- The map code asks for both layers the same way, in every part. What changes is who the portal thinks is asking.

## The comparison table

Fill in one column at the end of each part. You can type straight into this file.

| | No sign-in | API key | User authentication | App authentication |
|---|---|---|---|---|
| Who the portal sees | | | | |
| What we set up in the portal | | | | |
| What ends up in the browser | | | | |
| Is there a secret, and where is it? | | | | |
| Can two people see different things? | | | | |
| What happens when it expires? | | | | |
| Does it need a server of our own? | | | | |

## Part 0: No sign-in (about 10 min)

- **Set up in the portal:** nothing. That's the point.
- **Wire it in:** nothing. `VITE_AUTH_MODE` is already `none`.
- **Observe:**
  - "Trailheads (public)" says "Loaded". It's shared with everyone, so nobody has to prove anything.
  - "Private layer" doesn't load. The SDK notices, and puts up a sign-in box of its own. Click **Cancel**. The row now says "Not loaded", with the reason.
  - Open the browser's developer tools (press **F12**), and click the **Network** tab. Reload the page, and cancel the box again.
  - Find the request for the private layer: its address is the one in your `VITE_PRIVATE_LAYER_URL`. Click it, and read the **Response**. The portal is asking for a token.
- A **token** is a temporary pass. The portal hands one out, and it's shown with every request after that.
- **Break it on purpose:** it's already broken. This failure is where the next three parts start.
- **When to choose it:** when everything the app shows is shared with everyone.

**Checkpoint:** the trailheads are on the map, the private layer isn't, and you've found the refused request in the Network tab.

## Part 1: API key (about 20 min)

- **Set up in the portal:** your instructor does this on screen, and hands out the key.
  - They make an API key that can reach **one item:** the private layer. Nothing else.
- **Wire it in:**
  - In `.env.development`, paste the key after `VITE_ARCGIS_API_KEY=`, and change `VITE_AUTH_MODE` to `apiKey`.
  - In `auth/auth.ts`, fill in the Part 1 branch. Give the SDK the key, and the two addresses it may go to:
    `esriConfig.apiKeys.scopes = [{ token: config.apiKey, urls: [config.portalUrl, config.privateLayerServer] }]`
  - That line is for ArcGIS Enterprise, which is what the class portal is. If your instructor says the lab is on ArcGIS Online, it's shorter: `esriConfig.apiKey = config.apiKey`
  - Stop the app, and start it again.
- **Observe:**
  - The private layer says "Loaded", and nobody signed in. Click "Zoom to" on its row to find it on the map.
  - In the Network tab, click the request for the private layer. The key is there, in plain view. Anyone who opens the app can copy it.
- **Break it on purpose:**
  - Change one character of the key in `.env.development`, and restart. The layer is refused again. Put the key back.
  - Your instructor adds a **referrer limit** to the key that names a different address. Everyone's layer stops loading. They remove it, and it comes back.
- **When to choose it:** a public app, used by people with no ArcGIS accounts, that needs a small, specific set of content.

**Checkpoint:** the private layer is on the map, the header says "The portal sees: An API key", and you've found the key in the Network tab.

## Part 2: User authentication (about 25 min)

This is the method from the Signing In section. Everything here was shown there. Now it's yours to do.

- **Set up in the portal:** already done.
  - Use the app registration you made in the Signing In section, and its **client ID**.
  - Open its item in the portal, and check its redirect address is **your app's address** (see "Your app's address", above).
  - Leave the client secret beside it alone. That's for Part 3.
- **Wire it in:**
  - In `.env.development`, paste the client ID after `VITE_ARCGIS_CLIENT_ID=`, and change `VITE_AUTH_MODE` to `user`.
  - In `auth/auth.ts`, fill in the Part 2 branch. Call `identityManager.registerOAuthInfos(...)` with a list that holds one `new OAuthInfo({...})`. It takes three things: `appId: config.clientId`, `portalUrl: config.portalUrl`, and `popup: false`.
  - `popup: false` means "sign in on the portal's own page, then come back".
  - Stop the app, and start it again. The header says "The portal sees: Nobody yet", and the private layer says "Sign in to load it".
- Now the buttons. Open `auth/SignInButtons.tsx`.
  - Get the sign-in status with `useAuth()`, from `./AuthContext`. It hands back a `status`, and two functions: `signIn` and `signOut`.
  - While `status` is `'checking'`, return `null`. We don't know yet, so show neither button.
  - When `status` is `'signedOut'`, return a button that says "Sign in", and calls `signIn` when clicked.
  - Otherwise, return a button that says "Sign out", and calls `signOut`.
- **Observe:**
  - Click "Sign in". You land on the portal's own sign-in page, the one you already know. Our app never sees your password.
  - Back in the app, the private layer says "Loaded", and the header shows **your** name.
  - "My account" in the header was greyed out until now. Click it: your name, your role, and the groups the portal says you belong to.
  - Compare "My account" with the person beside you. One of you has a group the other doesn't. Same app, same code, different person.
  - Click "Sign out", then add `/account` to the end of your app's address and press **Enter**. A sign-in prompt stands in for the page.
- **Break it on purpose:**
  - Stop the app, and start it on a different port: `npm run dev -- --port 5174`. Open the new address. In a codespace, find it in the **Ports** tab.
  - Click "Sign in". The portal says the redirect is invalid. The same app on another port is a different address, and it isn't on the registration's list.
  - Stop the app, and start it the usual way: `npm run dev`.
- **When to choose it:** whenever the people using the app have ArcGIS accounts. For an organization's own apps, that's nearly always.

**Checkpoint:** your own name is in the header, the private layer is on the map, and you've seen the "invalid redirect" page once.

## Part 3: App authentication (about 20 min)

- The situation: the app needs the private layer, the people using it have no ArcGIS accounts, and an API key isn't enough.
- The app signs in **as itself**, with a client ID and a **client secret**.
- A secret can't go in the browser. Part 1 showed why: we read the key straight out of the Network tab. So the secret goes in a small server, and the React app asks that server for a token.
- The server is already written: `server/token-server.mjs`, at the top level of the project. Open it and read it. It's short.
- **Set up in the portal:** your instructor does this on screen, and hands out a client ID and a client secret. They may run this whole part as a demo.
- **Wire it in:**
  - The server has a settings file of its own. In the `server` folder, make a new file named `.env.local`. Copy everything from `server/.env.example` into it, and fill in the three values.
  - There's no `VITE_` in front of those names. Vite never reads that file, so nothing in it reaches the browser.
  - Open a **second** terminal: in the menu, click **Terminal**, then **New Terminal**. Start the server in it:
    `node --env-file=server/.env.local server/token-server.mjs`
  - In `.env.development`, change `VITE_AUTH_MODE` to `app`.
  - In `auth/auth.ts`, fill in the Part 3 branch, with two lines. The first asks our server for a token. The second gives it to the SDK.

    ```ts
    const { token } = await fetch(config.tokenUrl).then((response) => response.json())
    identityManager.registerToken({ server: `${config.portalUrl}/sharing/rest`, token })
    ```

  - In the first terminal, stop the app, and start it again.
- **Observe:**
  - The private layer says "Loaded", and nobody signed in. The header says "The portal sees: The app".
  - Look for the client secret in the Network tab. It isn't anywhere.
  - The token **is** in the Network tab. And opening the token server's address in a new browser tab shows one to anybody.
- **Break it on purpose:**
  - In the second terminal, stop the token server with **Ctrl + C**. Reload the app: no token, so the lab can't start, and the page says why.
  - Start the server again, and reload.
- **When to choose it:** when there's nobody to sign in, and the job needs a secret, a rule nobody may skip, or no browser at all, such as a script that runs overnight.

**Checkpoint:** the private layer is on the map, the header says "The portal sees: The app", and you've confirmed the secret is not in the browser.

### If you're in a codespace

The token server runs inside the codespace, so your browser can't reach it at `localhost`. Three more steps:

1. Open the **Ports** tab. Right-click port **3001**, choose **Port Visibility**, then **Public**.
2. Copy that port's address from the Ports tab, and paste it after `VITE_TOKEN_URL=` in `.env.development`.
3. In `server/.env.local`, take the `#` off the `APP_ORIGIN` line, and paste your app's address after the `=`. Then stop and start both the server and the app.

## Part 4: Choosing a method (about 10 min)

- Finish the comparison table together.
- Three questions, in order:
  1. Is everything the app shows shared with everyone? **Yes:** no sign-in.
  2. If not, do the people using it have ArcGIS accounts? **Yes:** user authentication.
  3. If not, does it need a secret, a rule nobody may skip, or to run with no browser? **Yes:** app authentication, on a server. **No:** an API key, limited to the items it needs.
- Which method, and why?
  1. A public map of park trailheads. All the data is public.
  2. An app for field staff to edit inspection records. The manager needs to know who changed what.
  3. A public website that shows one layer the organization doesn't share with everyone. Visitors have no accounts, and the data is low-risk.
  4. A script that runs every night and updates a layer from another system.
  5. A public app where visitors may see only the "open" rows of a sensitive layer.
  6. An internal dashboard, in an organization where everyone signs in with their Windows login.

## Wrap-up

- What changed in the map code, from Part 0 to Part 3? **Nothing.** `map/LabMap.tsx` asks for the layer the same way every time. The SDK attaches whatever `setUpAuth()` gave it.
- What we never touched: anyone's password. The portal's own page took it.
- Three lists had to know our app's address. When an app moves to a new address, all three need updating:

| The list | Who checks it | Where we met it |
|---|---|---|
| Allowed origins (CORS) | The browser | Every part, and our own token server in Part 3 |
| The referrer limit on an API key | The portal | Part 1 |
| The redirect address on an app registration | The portal | Part 2 |

- When you finish, change `VITE_AUTH_MODE` back to `none`. Your instructor deletes the key and the secret after class.

## Stretch goals

- In Part 2, show the user's portal role beside their name in the header. It's `user.role`, on the account object that `useAuth()` hands back.
- In Part 2, add a page that only members of one group can open. The list of pages and their rules is in `navigation/pageList.ts`, and "My account" shows each group's ID.
- In Part 3, change the token server so it runs a query itself and sends back only the features. The token then never leaves the server.
