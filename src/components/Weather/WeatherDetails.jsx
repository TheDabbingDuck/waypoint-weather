// src/components/Weather/WeatherDetails.jsx
import React, {useEffect, useState} from "react";
import {getAlerts, getForecast, getLatestObservation, getPointMetadata,} from "../../api/nws";
import CurrentConditions from "./CurrentConditions";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import Alerts from "./Alerts";
import Spinner from "../Shared/Spinner";
import ErrorBanner from "../Shared/ErrorBanner";

/**
 * If station‐based observation fails or is unavailable, convert the first hourly period
 * into a “fake” observation that CurrentConditions can render.
 */
function hourlyToObs(hourlyPeriod) {
    const tempF = hourlyPeriod.temperature;
    const c = ((tempF - 32) * 5) / 9;

    let windVal = null;
    if (hourlyPeriod.windSpeed) {
        // e.g. "10 to 16 mph"
        const match = hourlyPeriod.windSpeed.match(/(\d+)\s*to\s*(\d+)/);
        if (match) {
            const lo = parseInt(match[1], 10);
            const hi = parseInt(match[2], 10);
            const midMph = (lo + hi) / 2;
            windVal = midMph * 0.44704;
        } else {
            const single = parseInt(hourlyPeriod.windSpeed, 10);
            if (!isNaN(single)) {
                windVal = single * 0.44704;
            }
        }
    }

    return {
        // This shape matches what CurrentConditions expects at the top level
        temperature: { value: c, unitCode: "wmoUnit:degC" },
        windSpeed: windVal != null ? { value: windVal, unitCode: "wmoUnit:m_s-1" } : null,
        windDirection: null,
        textDescription: hourlyPeriod.shortForecast,
        relativeHumidity: { value: null },
        timestamp: hourlyPeriod.startTime,
    };
}

/**
 * WeatherDetails fetches and displays:
 *   • Current Conditions (via nearest station OR first-hourly-period fallback)
 *   • Active Alerts (or “No active alerts.”)
 *   • Hourly Forecast (cards)
 *   • 7-Day Forecast (cards)
 *
 * Expects `place = { lat, lng, name, placeId }`.
 */
export default function WeatherDetails({ place }) {
    const [state, setState] = useState({
        current: null,   // Either station‐based obs or fake obs from hourly[0]
        hourly: [],
        daily: [],
        alerts: [],
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!place) return;

        let isMounted = true;

        async function fetchAll() {
            setState((prev) => ({
                ...prev,
                isLoading: true,
                error: null,
            }));

            try {
                // 1. Fetch /points metadata
                const rawPoints = await getPointMetadata(place.lat, place.lng);
                const pts = rawPoints.properties ?? rawPoints;
                const { forecast, forecastHourly, observationStations } = pts;

                if (!forecast || !forecastHourly) {
                    console.error("Points response missing forecast URLs:", rawPoints);
                    throw new Error(
                        "Unable to find forecast URLs for this location. Please try a nearby point."
                    );
                }

                // 2. Fetch 7-Day (daily) forecast
                const dailyJson = await getForecast(forecast);
                const dailyPeriods =
                    dailyJson.properties?.periods ?? dailyJson.periods ?? [];

                // 3. Fetch hourly forecast
                const hourlyJson = await getForecast(forecastHourly);
                const hourlyPeriods =
                    hourlyJson.properties?.periods ?? hourlyJson.periods ?? [];

                // 4. Try station‐based current observation
                let currentObs = null;
                if (observationStations && typeof observationStations === "string") {
                    const stationsRes = await fetch(observationStations, {
                        headers: {
                            "User-Agent": "WaypointWeather (example@example.com)",
                            Accept: "application/ld+json",
                        },
                    });
                    if (stationsRes.ok) {
                        const stationsJson = await stationsRes.json();
                        // The returned JSON has `observationStations`: array of station URLs
                        const stationList = stationsJson.observationStations;
                        if (Array.isArray(stationList) && stationList.length > 0) {
                            const firstStationUrl = stationList[0];
                            try {
                                // Fetch the latest observation for that station URL
                                currentObs = await getLatestObservation(firstStationUrl);
                            } catch (obsErr) {
                                console.warn("Failed to fetch latest observation:", obsErr);
                                currentObs = null;
                            }
                        }
                    } else {
                        console.warn(
                            "Failed to fetch observation stations list:",
                            stationsRes.status,
                            stationsRes.statusText
                        );
                    }
                }

                // 5. If station-based failed, fallback to first hourly period
                if (!currentObs && hourlyPeriods.length > 0) {
                    currentObs = hourlyToObs(hourlyPeriods[0]);
                }

                // 6. Fetch active alerts
                const alertsJson = await getAlerts(place.lat, place.lng);
                const alertsArray = alertsJson.features ?? [];

                if (isMounted) {
                    setState({
                        current: currentObs,
                        hourly: hourlyPeriods,
                        daily: dailyPeriods,
                        alerts: alertsArray,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: err.message,
                    }));
                }
            }
        }

        fetchAll();

        return () => {
            isMounted = false;
        };
    }, [place]);

    if (state.isLoading) {
        return <Spinner />;
    }

    if (state.error) {
        return (
            <ErrorBanner
                message={state.error}
                onRetry={() => {
                    setState((prev) => ({ ...prev, error: null }));
                }}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Current Conditions Section */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Current Conditions</h2>
                {state.current ? (
                    // `state.current` is either the real obsJson (with temperature, etc. at top level)
                    // or the fake obs from hourlyToObs (already at top level).
                    <CurrentConditions data={state.current} placeName={place.name} />
                ) : (
                    <p className="text-gray-600">
                        Current observations unavailable.
                    </p>
                )}
            </section>

            {/* Alerts Section */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Alerts</h2>
                {state.alerts.length > 0 ? (
                    <Alerts data={state.alerts} />
                ) : (
                    <p className="text-gray-600">No active alerts.</p>
                )}
            </section>

            {/* Hourly Forecast Section */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Hourly Forecast</h2>
                {state.hourly.length > 0 ? (
                    <HourlyForecast data={state.hourly} />
                ) : (
                    <p className="text-gray-600">Hourly forecast unavailable.</p>
                )}
            </section>

            {/* Daily Forecast Section */}
            <section>
                <h2 className="text-xl font-semibold mb-2">7-Day Forecast</h2>
                {state.daily.length > 0 ? (
                    <DailyForecast data={state.daily} />
                ) : (
                    <p className="text-gray-600">7-day forecast unavailable.</p>
                )}
            </section>
        </div>
    );
}
