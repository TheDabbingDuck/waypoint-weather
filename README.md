# WaypointWeather

WaypointWeather is a React-based, client-side web app that lets users search for specific points of interest in the U.S. and view current weather conditions, hourly forecasts, 7-day forecasts, and active alerts for that location. Users can save favorites and see recent searches. Tailwind CSS is used for styling, and the app is deployed on GitHub Pages.

---

## Table of Contents

1. [Features](#features)
2. [Development Setup](#development-setup)
3. [Available Scripts](#available-scripts)
4. [Troubleshooting](#troubleshooting)
5. [Deployment](#deployment)
6. [API Key Handling](#api-key-handling)

---

## Features

* **Point-of-Interest Search**: Autocomplete search (Google Places) restricted to U.S. locations.
* **Current Conditions**: Fetches latest observation from nearest NWS station; falls back to first hourly forecast if unavailable.
* **Hourly Forecast**: Next 12 hours in a scrollable list.
* **7-Day Forecast**: Responsive grid of daytime periods.
* **Alerts**: Displays active NWS alerts or “No active alerts.”
* **Favorites & Recents**: Save favorites (persistent) and view recent searches (session-only).
* **Responsive Design**: Mobile-first layout with Tailwind’s responsive utilities.
* **Static Deployment**: Hosted on GitHub Pages (no backend required).

---

## Development Setup

### Prerequisites

* Node.js (v16+)
* npm (v8+)
* Git

### Clone & Install

```bash
git clone https://github.com/thedabbingduck/waypoint-weather.git
cd waypoint-weather
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```ini
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

* Restrict this key in Google Cloud Console to `http://localhost:3000/*` and your GitHub Pages domain.
* Ensure `.gitignore` includes `.env.local`.

### Run Locally

```bash
npm start
```

* Opens at `http://localhost:3000`.

### Folder Structure

```
waypointweather/
├── public/              # Static assets
├── src/
│   ├── api/             # NWS API helpers
│   ├── components/      # React components
│   ├── index.js
│   └── index.css        # Tailwind imports
├── .gitignore
├── package.json
└── README.md
```

---

## Available Scripts

From project root:

* `npm start`
  Launches development server on `http://localhost:3000`.

* `npm run build`
  Builds production assets into `build/`.

* `npm run deploy`
  Builds and publishes `build/` to the `gh-pages` branch (requires `gh-pages` package).

* `npm run lint` (if configured)
  Runs ESLint checks.

* `npm test` (if tests exist)
  Runs test suite.

---

## Troubleshooting

* **Search Not Loading**:

    * Verify `REACT_APP_GOOGLE_MAPS_API_KEY` is valid and restricted to `localhost:3000`.
    * Check DevTools Network for failed requests to `maps.googleapis.com`.

* **Current Conditions Fallback**:

    * Ensure `User-Agent` header is set when fetching NWS data. In `src/api/nws.js`, use:

      ```js
      headers: {
        "User-Agent": "WaypointWeather (your-email@example.com)",
        Accept: "application/ld+json",
      }
      ```

* **Favorites Not Persisting**:

    * Confirm browser allows `localStorage`.
    * Check console logs for `Initialize favorites from localStorage:` and `Saved favorites to localStorage:`.

* **Build Failing**:

    * Use Node.js v16+ and run `npm ci`.
    * Ensure `package.json` scripts are correct.

---

## Deployment

1. Add `"homepage": "https://<your-github-username>.github.io/waypointweather"` to `package.json`.
2. Add to `package.json` scripts:

   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Install `gh-pages`:

   ```bash
   npm install --save-dev gh-pages
   ```
4. Push to GitHub, set Pages source to `gh-pages` branch (root).
5. Run:

   ```bash
   npm run deploy
   ```
6. Visit `https://<your-github-username>.github.io/waypointweather/`.

---

## API Key Handling

* The Google Maps API key is exposed in the frontend bundle. To limit misuse:

    1. Restrict key to your allowed HTTP referrers (`localhost:3000`, GitHub Pages URL).
    2. Restrict key’s API scope to “Maps JavaScript API” and “Places API.”
    3. Regenerate the key if compromised.

* To fully hide the key, you’d need a proxy backend to sign requests, but that requires additional hosting.

---

## Contributing

1. Fork or clone the repo.
2. Create a branch for your feature/pr.
3. Commit changes, open a PR with a clear description.
4. Maintain Tailwind styling conventions (mobile-first, then `sm:`, `md:`).
5. Run tests/lint before merging.

---

## License

GNU GENERAL PUBLIC LICENSE © WaypointWeather
