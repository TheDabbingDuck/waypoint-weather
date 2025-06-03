// api/nws.js

/**
 * User-Agent string used for API requests to identify the application.
 * @constant {string}
 */
const USER_AGENT = "WaypointWeather (calebtian@my.utexas.edu)";

/**
 * Fetches metadata for a geographic point given its latitude and longitude.
 * The metadata includes information such as the associated weather station and forecast URLs.
 *
 * @async
 * @function getPointMetadata
 * @param {number} lat - Latitude of the geographic point.
 * @param {number} lon - Longitude of the geographic point.
 * @returns {Promise<Object>} A promise that resolves to the metadata JSON object.
 * @throws {Error} Throws an error if the API request fails.
 */
async function getPointMetadata(lat, lon) {
    const url = `https://api.weather.gov/points/${lat},${lon}`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json"
        },
    });
    if (!res.ok) {
        throw new Error(`Points lookup failed: ${res.statusText}`);
    }
    return res.json();
}

/**
 * Fetches the weather forecast data from a given forecast URL.
 * The forecast data includes detailed weather predictions for the specified location.
 *
 * @async
 * @function getForecast
 * @param {string} forecastUrl - URL to fetch the forecast data from.
 * @returns {Promise<Object>} A promise that resolves to the forecast JSON object.
 * @throws {Error} Throws an error if the API request fails.
 */
async function getForecast(forecastUrl) {
    const res = await fetch(forecastUrl, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json"
        },
    });
    if (!res.ok) {
        throw new Error(`Forecast fetch failed: ${res.statusText}`);
    }
    return res.json();
}

/**
 * Fetches the latest weather observation data for a given station URL.
 * The observation data includes current weather conditions such as temperature, wind speed, etc.
 *
 * @async
 * @function getLatestObservation
 * @param {string} stationUrl - URL of the weather station to fetch the latest observation from.
 * @returns {Promise<Object>} A promise that resolves to the latest observation JSON object.
 * @throws {Error} Throws an error if the API request fails.
 */
async function getLatestObservation(stationUrl) {
    const res = await fetch(`${stationUrl}/observations/latest`, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json"
        },
    });
    if (!res.ok) {
        throw new Error(`Observations fetch failed: ${res.statusText}`);
    }
    return res.json();
}

/**
 * Fetches active weather alerts for a given geographic point specified by latitude and longitude.
 * The alerts include information about severe weather conditions such as storms, floods, etc.
 *
 * @async
 * @function getAlerts
 * @param {number} pointLat - Latitude of the geographic point.
 * @param {number} pointLon - Longitude of the geographic point.
 * @returns {Promise<Object>} A promise that resolves to the active alerts JSON object.
 * @throws {Error} Throws an error if the API request fails.
 */
async function getAlerts(pointLat, pointLon) {
    const url = `https://api.weather.gov/alerts/active?point=${pointLat},${pointLon}`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/ld+json"
        },
    });
    if (!res.ok) {
        throw new Error(`Alerts fetch failed: ${res.statusText}`);
    }
    return res.json();
}

export {
    getPointMetadata,
    getForecast,
    getLatestObservation,
    getAlerts,
};