// src/api/nws.js

const USER_AGENT = "WaypointWeather (calebtian@my.utexas.edu)";

/**
 * Fetch metadata for a latitude/longitude point from NWS.
 * Returns JSON with links for forecast, forecastHourly, observationStations, etc.
 */
export async function getPointMetadata(lat, lon) {
    const url = `https://api.weather.gov/points/${lat},${lon}`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json",
        },
    });
    if (!res.ok) {
        throw new Error(`Points lookup failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

/**
 * Fetch a forecast (daily or hourly) given its full URL.
 * Returns the parsed JSON.
 */
export async function getForecast(forecastUrl) {
    const res = await fetch(forecastUrl, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json",
        },
    });
    if (!res.ok) {
        throw new Error(`Forecast fetch failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

/**
 * Fetch the latest observation from a station URL (without the "/observations/latest" suffix).
 * Returns the parsed JSON.
 */
export async function getLatestObservation(stationUrl) {
    // stationUrl is expected to be like "https://api.weather.gov/stations/{stationId}"
    const url = `${stationUrl}/observations/latest`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json",
        },
    });
    if (!res.ok) {
        throw new Error(
            `Observations fetch failed: ${res.status} ${res.statusText}`
        );
    }
    return res.json();
}

/**
 * Fetch active alerts for a given latitude/longitude.
 * Returns the parsed JSON.
 */
export async function getAlerts(lat, lon) {
    const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json",
        },
    });
    if (!res.ok) {
        throw new Error(`Alerts fetch failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
}
