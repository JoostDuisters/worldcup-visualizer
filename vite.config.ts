import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/worldcup-visualizer/ on GitHub Pages.
  base: '/worldcup-visualizer/',
  plugins: [react()],
})
