// src/components/Weather/CurrentConditions.jsx
import React from "react";

/**
 * Displays the latest observation (current conditions).
 * Expects `data` to conform to NWS observation properties.
 * @param {{ data: object, placeName: string }} props
 */
export default function CurrentConditions({ data, placeName }) {
    // Some fields may be null; render only if available
    const {
        temperature,
        windSpeed,
        windDirection,
        textDescription,
        relativeHumidity,
        // NWS sometimes provides an icon under properties, but for observations, we use textDescription
        timestamp,
    } = data;

    // Convert Celsius to Fahrenheit if needed (NWS returns Celsius)
    const tempF =
        temperature && temperature.value !== null
            ? Math.round((temperature.value * 9) / 5 + 32)
            : null;

    const humidity = relativeHumidity?.value
        ? `${Math.round(relativeHumidity.value)}%`
        : null;

    const wind = windSpeed?.value
        ? `${Math.round((windSpeed.value * 2.237).toFixed(1))} mph ${
            windDirection?.value != null
                ? `${Math.round(windDirection.value)}°`
                : ""
        }`
        : null;

    // Format timestamp
    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "";

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">
                Current Conditions at {placeName}
            </h2>
            <p className="text-sm text-gray-500 mb-4">Last updated: {formattedTime}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tempF != null && (
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">{tempF}°F</span>
                        <span className="text-sm text-gray-600">Temperature</span>
                    </div>
                )}
                {textDescription && (
                    <div className="flex flex-col items-center">
                        <span className="text-lg">{textDescription}</span>
                        <span className="text-sm text-gray-600">Conditions</span>
                    </div>
                )}
                {wind && (
                    <div className="flex flex-col items-center">
                        <span className="text-lg">{wind}</span>
                        <span className="text-sm text-gray-600">Wind</span>
                    </div>
                )}
                {humidity && (
                    <div className="flex flex-col items-center">
                        <span className="text-lg">{humidity}</span>
                        <span className="text-sm text-gray-600">Humidity</span>
                    </div>
                )}
            </div>
        </div>
    );
}
