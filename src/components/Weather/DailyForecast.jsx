// src/components/Weather/DailyForecast.jsx
import React from "react";
import { getWeatherIcon } from "../../utils/weatherIcons";

/**
 * Formats the NWS period name (e.g., "Tonight", "Monday", "Juneteenth National Independence Day")
 * to display the day of the week primarily, and optionally the holiday name if present.
 * @param {string} periodName - The name of the forecast period from NWS.
 * @param {string} startTime - The ISO start time of the period.
 * @returns {string} Formatted day name (e.g., "Monday", "Friday (Juneteenth)").
 */
function formatDayName(periodName, startTime) {
    const date = new Date(startTime);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    // List of common holiday keywords that NWS might include. This can be expanded.
    const holidays = [
        "New Year's Day", "Martin Luther King Jr. Day", "Washington's Birthday", "Presidents' Day",
        "Memorial Day", "Juneteenth National Independence Day", "Independence Day", "Labor Day",
        "Columbus Day", "Veterans Day", "Thanksgiving Day", "Christmas Day"
    ];

    let holidayName = null;
    for (const holiday of holidays) {
        if (periodName.includes(holiday)) {
            // Extract a shorter version of the holiday name if needed, or use as is.
            // For Juneteenth, NWS uses the full official name.
            if (holiday === "Juneteenth National Independence Day") {
                holidayName = "Juneteenth";
            } else if (holiday === "Washington's Birthday") {
                holidayName = "Presidents' Day"; // Common name
            }
            // Add more specific shortenings if desired
            else {
                holidayName = holiday.replace(" Day", ""); // Simple removal of " Day"
            }
            break;
        }
    }

    if (holidayName && holidayName !== dayOfWeek) {
        return `${dayOfWeek} (${holidayName})`;
    }

    // If the periodName is just the day (e.g., "Monday", "Tuesday"), use it directly if it matches dayOfWeek.
    // Otherwise, prioritize the calculated dayOfWeek for consistency.
    if (periodName === dayOfWeek) {
        return periodName;
    }
    return dayOfWeek;
}

/**
 * Renders a grid of daily forecast cards.
 * Expects `data` to be an array of daily period objects from NWS.
 * No section title here—WeatherDetails will render the “7-Day Forecast” header.
 * @param {{ data: Array }} props
 */
export default function DailyForecast({data}) {
    // Filter to only daytime periods so each day appears once
    const dayPeriods = data.filter((period) => period.isDaytime);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {dayPeriods.map((day) => {
                const {
                    number,
                    name, // Original NWS period name
                    startTime, // Need startTime for formatting
                    temperature,
                    temperatureUnit,
                    windSpeed,
                    windDirection,
                    shortForecast,
                } = day;

                // Get custom weather icon based on the forecast description
                const weatherIcon = getWeatherIcon(shortForecast);
                const displayDayName = formatDayName(name, startTime);

                return (
                    <div
                        key={number}
                        className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        <span className="text-lg font-semibold text-gray-700 mb-2">{displayDayName}</span>
                        <img
                            src={weatherIcon}
                            alt={shortForecast}
                            className="w-20 h-20 sm:w-24 sm:h-24 my-2"
                        />
                        <span className="text-3xl font-bold text-blue-600 mt-2">
                            {temperature}°<span className="text-xl">{temperatureUnit}</span>
                        </span>
                        <span className="text-sm text-gray-600 mt-1 px-2">{shortForecast}</span>
                        {windSpeed && (
                            <span className="text-xs text-gray-500 mt-2">
                                {windSpeed.replace(/[^0-9a-zA-Zto ]/g, "")} {windDirection || ""}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
