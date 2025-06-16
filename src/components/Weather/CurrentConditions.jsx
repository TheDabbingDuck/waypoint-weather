// src/components/Weather/CurrentConditions.jsx
import React from "react";
import { getWeatherIcon, getWeatherBackgroundClass } from "../../utils/weatherIcons";

// Helper function to convert mm to inches, rounded to 2 decimal places
const mmToInches = (mm) => {
    if (mm === null || mm === undefined) return null;
    return (mm * 0.0393701).toFixed(2);
};

// Helper function to convert meters to miles
const metersToMiles = (meters) => {
    if (meters === null || meters === undefined) return null;
    const miles = meters / 1609.34;
    if (miles >= 10) return "10+ mi";
    return `${miles.toFixed(1)} mi`;
};

// Helper function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
    if (celsius === null || celsius === undefined) return null;
    return Math.round((celsius * 9) / 5 + 32);
};

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
        precipitationLastHour, // Added
        visibility, // Added
        windChill,  // Added
        heatIndex,  // Added
    } = data;

    // Convert Celsius to Fahrenheit if needed (NWS returns Celsius)
    const actualTempC = temperature?.value;
    const tempF = celsiusToFahrenheit(actualTempC);

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

    const precipLastHourInches = mmToInches(precipitationLastHour?.value);
    const visibilityMiles = metersToMiles(visibility?.value);

    let feelsLikeTempF = null;
    const windChillF = celsiusToFahrenheit(windChill?.value);
    const heatIndexF = celsiusToFahrenheit(heatIndex?.value);

    if (tempF !== null) {
        if (tempF < 60 && windChillF !== null && windChillF < tempF - 3) { // Show wind chill if temp < 60F and chill is lower
            feelsLikeTempF = `${windChillF}°F (Wind Chill)`;
        } else if (tempF > 75 && heatIndexF !== null && heatIndexF > tempF + 3) { // Show heat index if temp > 75F and index is higher
            feelsLikeTempF = `${heatIndexF}°F (Heat Index)`;
        } else if (windChillF !== null && windChillF < tempF - 3) { // Fallback to windchill if significant
             feelsLikeTempF = `${windChillF}°F (Wind Chill)`;
        } else if (heatIndexF !== null && heatIndexF > tempF + 3) { // Fallback to heat index if significant
             feelsLikeTempF = `${heatIndexF}°F (Heat Index)`;
        }
    }

    return (
        <div className={`rounded-xl shadow-xl p-4 sm:p-6 ${bgColorClass} transition-colors duration-500 weather-current-animation`}>
            <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
                <div className="mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0">
                    <img
                        src={weatherIcon}
                        alt={textDescription || "Weather"}
                        className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg"
                    />
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {placeName}
                    </h2>
                    <p className="text-sm text-gray-600">Last updated: {formattedTime}</p>
                    {textDescription && (
                         <p className="text-lg text-gray-700 mt-1">{textDescription}</p>
                    )}
                </div>
            </div>

            {/* Adjusted grid for up to 6 items: 2 cols on small, 3 on medium+ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4">
                {tempF !== null && (
                    <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md min-h-[5rem] sm:min-h-[6rem]">
                        <span className="text-3xl sm:text-4xl font-bold text-blue-600">{tempF}°F</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">Temperature</span>
                    </div>
                )}
                {feelsLikeTempF && (
                    <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md min-h-[5rem] sm:min-h-[6rem]">
                        <span className="text-xl sm:text-2xl font-semibold text-gray-700 text-center">{feelsLikeTempF}</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">Feels Like</span>
                    </div>
                )}
                {humidity && (
                    <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md min-h-[5rem] sm:min-h-[6rem]">
                        <span className="text-xl sm:text-2xl font-semibold text-gray-700">{humidity}</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">Humidity</span>
                    </div>
                )}
                {wind && (
                    <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md min-h-[5rem] sm:min-h-[6rem]">
                        <span className="text-lg sm:text-xl font-medium text-gray-700 text-center">{wind}</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">Wind</span>
                    </div>
                )}
                {precipLastHourInches !== null && parseFloat(precipLastHourInches) >= 0 && (
                    <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md min-h-[5rem] sm:min-h-[6rem]">
                        <span className="text-lg sm:text-xl font-medium text-gray-700">{precipLastHourInches} in</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">Precip (1hr)</span>
                    </div>
                )}
                {visibilityMiles && (
                    <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md min-h-[5rem] sm:min-h-[6rem]">
                        <span className="text-xl sm:text-2xl font-semibold text-gray-700">{visibilityMiles}</span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">Visibility</span>
                    </div>
                )}
            </div>
        </div>
    );
}
