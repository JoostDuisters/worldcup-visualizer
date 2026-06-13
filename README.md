# worldcup-visualizer

## Development

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
npm run type-check
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages.

Live at: https://joostduisters.github.io/worldcup-visualizer/

Note: `base` in `vite.config.ts` must match the repo name (`/worldcup-visualizer/`).
