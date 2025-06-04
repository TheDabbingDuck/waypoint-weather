// src/components/Weather/HourlyForecast.jsx
import React from "react";

/**
 * Renders a horizontally scrollable list of hourly forecast cards.
 * Expects `data` to be an array of hourly period objects from NWS.
 * No section title here—WeatherDetails will render the “Hourly Forecast” header.
 * @param {{ data: Array }} props
 */
export default function HourlyForecast({ data }) {
    // Show next 12 hours (or fewer if not available)
    const nextHours = data.slice(0, 12);

    return (
        <div className="flex overflow-x-auto space-x-4 py-2">
            {nextHours.map((hour) => {
                const {
                    number,
                    name, // e.g., "2 PM"
                    temperature,
                    temperatureUnit,
                    windSpeed,
                    windDirection,
                    icon, // URL to icon image
                    shortForecast,
                } = hour;

                return (
                    <div
                        key={number}
                        className="flex-shrink-0 w-24 bg-white rounded-lg shadow p-2 flex flex-col items-center text-center"
                    >
                        <span className="text-sm font-medium">{name}</span>
                        {icon && (
                            <img
                                src={icon}
                                alt={shortForecast}
                                className="w-12 h-12 mt-1"
                            />
                        )}
                        <span className="text-lg font-semibold mt-1">
              {temperature}
                            {temperatureUnit}
            </span>
                        <span className="text-xs text-gray-600">{shortForecast}</span>
                        {windSpeed && (
                            <span className="text-xs text-gray-500 mt-1">
                {windSpeed.replace(/[^0-9to ]/g, "")} {windDirection || ""}
              </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
