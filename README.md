# [WaypointWeather](https://thedabbingduck.github.io/waypoint-weather/)

WaypointWeather is a React-based, client-side web app that lets users search for specific points of interest in the U.S. and view current weather conditions, hourly forecasts, 7-day forecasts, and active alerts for that location. Users can save favorites and see recent searches. Tailwind CSS is used for styling, and the app is deployed on GitHub Pages.

---

## Table of Contents

1. [Features](#features)
2. [Development Setup](#development-setup)
3. [Available Scripts](#available-scripts)
4. [Troubleshooting](#troubleshooting)
5. [Contributing](#contributing)

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
Note - you will need to obtain your own (free) Google Maps API key to use the search 
functionality locally. This can be done through the [Google Cloud Console](https://console.cloud.google.com/).

Create a `.env.local` file in the project root:

```ini
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

* Restrict this key in Google Cloud Console to `http://localhost:3000/*` for your own local testing.
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
  Builds and publishes `build/` to the `gh-pages` branch.
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
    * Check console logs for output and errors.

* **Build Failing**:

    * Use Node.js v16+ and run `npm ci`.
    * Ensure `package.json` scripts are correct.

---


## Contributing

1. Fork or clone the repo.
2. Create a branch for your feature/pr.
3. Commit changes, open a PR with a clear description.
4. Maintain Tailwind styling conventions (mobile-first, then `sm:`, `md:`).
5. Run tests/lint before merging.

---

## License

GNU GENERAL PUBLIC LICENSE 

© WaypointWeather 2025
