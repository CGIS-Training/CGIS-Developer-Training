import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // The Esri packages are already native ES modules. Pre-bundling them is slow
    // and memory-hungry, and stalls on small Codespaces machines.
    exclude: ['@arcgis/core', '@arcgis/map-components', '@esri/calcite-components'],
  },
  server: {
    // Matches the forwarded port in .devcontainer/devcontainer.json
    port: 5173,
    strictPort: true,
  },
})
