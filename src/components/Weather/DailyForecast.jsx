// src/components/Weather/DailyForecast.jsx
import React from "react";

/**
 * Renders a grid of daily forecast cards.
 * Expects `data` to be an array of daily period objects from NWS.
 * No section title here—WeatherDetails will render the “7-Day Forecast” header.
 * @param {{ data: Array }} props
 */
export default function DailyForecast({ data }) {
    // Filter to only daytime periods so each day appears once
    const dayPeriods = data.filter((period) => period.isDaytime);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayPeriods.map((day) => {
                const {
                    number,
                    name, // e.g., "Monday"
                    temperature,
                    temperatureUnit,
                    windSpeed,
                    windDirection,
                    icon, // URL to icon image
                    shortForecast,
                } = day;

                return (
                    <div
                        key={number}
                        className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
                    >
                        <span className="text-lg font-medium mb-1">{name}</span>
                        {icon && (
                            <img
                                src={icon}
                                alt={shortForecast}
                                className="w-16 h-16 mb-1"
                            />
                        )}
                        <span className="text-2xl font-semibold">
              {temperature}
                            {temperatureUnit}
            </span>
                        <span className="text-sm text-gray-600">{shortForecast}</span>
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
