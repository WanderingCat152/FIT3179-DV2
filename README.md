# DV2 neighbourhood accessibility website

This buildless website contains the 11-chart data story from the confirmed DV2 plan. Charts 1–8 and 10–11 use Vega-Lite; Chart 9 uses Vega for the alluvial flow diagram.

## Run locally

Serve the folder through an HTTP server rather than opening `index.html` directly. From this directory:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Structure

- `index.html` contains the narrative and chart containers.
- `css/styles.css` contains the responsive visual system.
- `js/main.js` embeds each chart.
- `charts/` contains one readable Vega or Vega-Lite JSON specification per chart.
- `data/` contains only the compact web-facing analytical and derived files.
- Vega, Vega-Lite and Vega-Embed are loaded from pinned jsDelivr CDN versions in `index.html`, following the course tutorial pattern.
- `scripts/prepare_chart_data.py` regenerates the representative-point and alluvial datasets used by Charts 6–9.

The page is designed for GitHub Pages and uses only relative paths.
