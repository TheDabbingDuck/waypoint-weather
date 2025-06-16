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
 * Extracts rainfall amount from detailed forecast string.
 * Example: "New rainfall amounts less than a tenth of an inch possible."
 * @param {string} detailedForecast - The detailed forecast string.
 * @returns {string|null} Formatted rainfall amount or null.
 */
function parseRainfallAmount(detailedForecast) {
    if (!detailedForecast) return null;
    const match = detailedForecast.match(/New rainfall amounts (less than a tenth|between a tenth and quarter|between a quarter and half|between a half and three quarters|between three quarters and one|around one) of an inch possible./i);
    if (match && match[1]) {
        const amountMap = {
            "less than a tenth": "< 0.1 in",
            "between a tenth and quarter": "0.1-0.25 in",
            "between a quarter and half": "0.25-0.5 in",
            "between a half and three quarters": "0.5-0.75 in",
            "between three quarters and one": "0.75-1 in",
            "around one": "~1 in"
        };
        return amountMap[match[1].toLowerCase()] || match[1];
    }
    // Add more specific regex if amounts are given directly, e.g., "0.25 inches"
    const specificAmountMatch = detailedForecast.match(/(\d*\.?\d+)\s*(inch|inches)/i);
    if (specificAmountMatch && specificAmountMatch[1]) {
        return `${parseFloat(specificAmountMatch[1]).toFixed(2)} in`;
    }
    return null;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {dayPeriods.map((day, index) => {
                const {
                    number,
                    name, // Original NWS period name
                    startTime, // Need startTime for formatting
                    temperature,
                    temperatureUnit,
                    probabilityOfPrecipitation, // Added
                    detailedForecast, // Added for rainfall amount
                    windSpeed,
                    windDirection,
                    shortForecast,
                } = day;

                // Get custom weather icon based on the forecast description
                const weatherIcon = getWeatherIcon(shortForecast);
                const displayDayName = formatDayName(name, startTime);
                const pop = probabilityOfPrecipitation?.value;
                const rainfall = parseRainfallAmount(detailedForecast);

                return (
                    <div
                        key={number || `daily-${index}`}
                        className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        style={{ animation: `fadeInUp 0.5s ${index * 0.07}s ease-out backwards` }} // Staggered animation
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
                        {pop !== null && pop >= 0 && (
                            <span className="text-sm text-blue-500 mt-1.5">Precipitation Chance: {pop}%</span>
                        )}
                        <span className="text-sm text-gray-600 mt-1 px-2 leading-tight">{shortForecast}</span>
                        {rainfall && (
                            <span className="text-xs text-gray-500 mt-1">Rainfall: {rainfall}</span>
                        )}
                        {windSpeed && (
                            <span className="text-xs text-gray-500 mt-1.5">
                                {windSpeed.replace(/[^0-9a-zA-Zto\s]/g, "")} {windDirection || ""}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
