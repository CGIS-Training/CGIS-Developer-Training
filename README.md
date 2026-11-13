# CGIS React Training

This is the project we use all week. Each day has a lab, and each lab adds to a small app, **City Viewer**. By the end of the week it works with real GIS data.

The setup is already done: **React**, **TypeScript**, and the **ArcGIS Maps SDK for JavaScript** are installed and working together.

AI features (GitHub Copilot, Copilot Chat, inline suggestions) are turned off in this project.

## Start the project in GitHub Codespaces

1. On the repository page, click **Code**, then **Codespaces**, then **Create codespace on main**.
2. Wait for setup to finish. The first time takes a few minutes while the packages install.
3. In the terminal at the bottom of the screen, type the command below and press **Enter**:

   ```
   npm run dev
   ```

4. The app opens in a new browser tab. If it doesn't, open the **Ports** tab and click the globe icon next to port **5173**.

## Start the project on your own computer

You need Node.js 24 installed first. The workshop's setup guide has the steps.

1. Open the project folder in Visual Studio Code.
2. Open a terminal: in the menu, click **Terminal**, then **New Terminal**.
3. Type the command below and press **Enter**. It downloads the packages, and takes a few minutes the first time:

   ```
   npm install
   ```

4. Type the command below and press **Enter**:

   ```
   npm run dev
   ```

5. In your browser, go to `http://localhost:5173`.

## While you work

- Leave `npm run dev` running in its terminal. When you save a file, the page in the browser updates by itself.
- To stop it, click in that terminal and press **Ctrl + C**.

## Your work and the solutions

Each day has two folders:

| Folder | What it is |
|---|---|
| `src/labs/day1` | **Your work** for the Day 1 lab. This is where you write code. |
| `src/solutions/day1` | The **finished** Day 1 lab. It arrives in the next morning's update. Read it; don't edit it. |

- Each day starts in a new folder that already works, so you never fall behind. Your code from the day before stays in its own folder, as you left it.
- If you are stuck on one step, open the same file in the solution folder and compare it with yours. You can copy that one file into your folder and keep the rest of your own code.
- The two folders have files with the same names. Before you type, check the folder name beside the file name on the editor's tab.

### Get the day's update

Each morning there is an update with two new folders: the finished version of yesterday's lab, and the starting point for today's lab. The update only adds folders. It doesn't change the files you have been working on.

1. Open a new terminal: in the menu, click **Terminal**, then **New Terminal**.
2. Type the command below and press **Enter**:

   ```
   git pull
   ```

3. Look in `src/solutions` and `src/labs`. The new folders are there.

### Choose what the app shows

The app shows one folder at a time. One line in `src/main.tsx` chooses which:

```tsx
import App from './labs/day1/App'
```

At the start of a new day, change the day in that line and save. For Day 2 it reads `import App from './labs/day2/App'`.

To see a finished lab running, once you have its folder:

1. Open `src/main.tsx`.
2. In that line, change `labs` to `solutions`, so it reads `import App from './solutions/day1/App'`.
3. Save the file. The page in the browser now shows the finished lab.
4. To go back to your own work, change `solutions` back to `labs` and save.

## What's in the project

| File or folder | What it is |
|---|---|
| `index.html` | The one HTML page. Our app is drawn inside it. |
| `src/main.tsx` | The starting point. It puts our app on the page, and one line in it chooses which lab the app shows. |
| `src/labs/day1/App.tsx` | Our app's first component. The Day 1 lab starts here. |
| `src/labs/day1/webMapLayers.ts` | The data for the Day 1 lab: the list of layers from a web map. |
| `src/labs/day1/app.css` | The styles for the app, already written. The top of the file lists the class names to use. |
| `src/solutions` | The finished labs. Each one arrives the morning after its lab. |
| `package.json` | The list of packages the project uses, and the commands we can run. |
| `node_modules` | The downloaded packages. Never edit it. |
| `vite.config.ts`, `tsconfig.json` | Settings for Vite and TypeScript. Already set up. |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app. The page updates when you save a file. |
| `npm run lint` | Checks the code for common mistakes. |
| `npm run build` | Checks the types, then builds the app the way it would be published. |
