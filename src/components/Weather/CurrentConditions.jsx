// src/components/Weather/CurrentConditions.jsx
import React from "react";
import { getWeatherIcon, getWeatherBackgroundClass } from "../../utils/weatherIcons";

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

    // Get custom weather icon based on the weather description
    const weatherIcon = getWeatherIcon(textDescription);

    // Get appropriate background color class based on weather and temperature
    const bgColorClass = getWeatherBackgroundClass(textDescription, tempF);

    return (
        <div className={`rounded-lg shadow-md p-6 ${bgColorClass} transition-colors duration-500`}>
            <div className="flex flex-col sm:flex-row items-center mb-4">
                <div className="mr-4 mb-4 sm:mb-0">
                    <img
                        src={weatherIcon}
                        alt={textDescription || "Weather"}
                        className="w-24 h-24"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">
                        Current Conditions at {placeName}
                    </h2>
                    <p className="text-sm text-gray-600">Last updated: {formattedTime}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {tempF != null && (
                    <div className="flex flex-col items-center bg-white bg-opacity-80 rounded-lg p-4 shadow-sm">
                        <span className="text-4xl font-bold text-blue-600">{tempF}°F</span>
                        <span className="text-sm text-gray-600 mt-2">Temperature</span>
                    </div>
                )}
                {textDescription && (
                    <div className="flex flex-col items-center bg-white bg-opacity-80 rounded-lg p-4 shadow-sm">
                        <span className="text-lg font-medium">{textDescription}</span>
                        <span className="text-sm text-gray-600 mt-2">Conditions</span>
                    </div>
                )}
                {wind && (
                    <div className="flex flex-col items-center bg-white bg-opacity-80 rounded-lg p-4 shadow-sm">
                        <span className="text-lg font-medium">{wind}</span>
                        <span className="text-sm text-gray-600 mt-2">Wind</span>
                    </div>
                )}
                {humidity && (
                    <div className="flex flex-col items-center bg-white bg-opacity-80 rounded-lg p-4 shadow-sm">
                        <span className="text-lg font-medium">{humidity}</span>
                        <span className="text-sm text-gray-600 mt-2">Humidity</span>
                    </div>
                )}
            </div>
        </div>
    );
}
