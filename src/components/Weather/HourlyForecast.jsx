// src/components/Weather/HourlyForecast.jsx
import React, { useRef, useEffect, useState } from "react";
import { getWeatherIcon } from "../../utils/weatherIcons";

/**
 * Format a date string to a more readable time format
 * @param {string} dateString - ISO date string
 * @returns {{time: string, day: string}} Formatted time and day qualifier
 */
function formatHourlyTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    // Format the time part (e.g., "2 PM")
    const timeFormatted = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    let dayQualifier;
    // Check if it's today, tomorrow, or another day
    if (date.toDateString() === now.toDateString()) {
        dayQualifier = "(Today)";
    } else if (date.getDate() === now.getDate() + 1 &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear()) {
        dayQualifier = "(Tomorrow)";
    } else {
        dayQualifier = `(${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
    }
    return { time: timeFormatted, day: dayQualifier };
}

const celsiusToFahrenheit = (celsius) => {
    if (celsius === null || celsius === undefined) return null;
    return Math.round((celsius * 9) / 5 + 32);
};

// Individual Card Component for Hourly Forecast
function HourlyCard({ hour, index }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const {
        startTime,
        temperature,
        temperatureUnit,
        probabilityOfPrecipitation,
        dewpoint, // Available in hourly data
        relativeHumidity, // Available in hourly data
        windSpeed,
        windDirection,
        shortForecast,
        detailedForecast, // Available, though might be empty
    } = hour;

    const { time, day } = formatHourlyTime(startTime); // Destructure here
    const weatherIcon = getWeatherIcon(shortForecast);
    const pop = probabilityOfPrecipitation?.value;
    const dewpointC = dewpoint?.value;
    const dewpointF = celsiusToFahrenheit(dewpointC);
    const humidityValue = relativeHumidity?.value;

    return (
        <div
            className={`flip-card-container group flex-shrink-0 min-w-[8.5rem] sm:w-36 h-56 sm:h-60 ${isFlipped ? 'flipped' : ''} hover:-translate-y-1 transition-transform duration-200 ease-in-out`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ animation: `fadeInUp 0.5s ${index * 0.05}s ease-out backwards` }}
        >
            <div className="flip-card">
                {/* Front of the Card */}
                <div className="flip-card-front">
                    <div className="flex flex-col items-center text-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{time}</span>
                        <span className="text-xs text-gray-500">{day}</span>
                    </div>
                    <img src={weatherIcon} alt={shortForecast} className="w-16 h-16 my-1 sm:my-2" />
                    <span className="text-xl font-bold text-blue-600 mt-1">{temperature}°{temperatureUnit}</span>
                    {pop !== null && pop >= 0 && (
                        <span className="text-xs text-blue-500 mt-1">Precip: {pop}%</span>
                    )}
                    <span className="text-xxs text-gray-500 mt-auto pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">See More</span>
                </div>

                {/* Back of the Card */}
                <div className="flip-card-back justify-around">
                    <div className="flex flex-col items-center text-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{time}</span>
                        <span className="text-xs text-gray-500">{day}</span>
                    </div>
                    <div className="text-xs text-gray-700 space-y-1 text-left px-1 overflow-y-auto hide-scrollbar max-h-[calc(100%-5rem)]"> {/* Adjusted max-h slightly if needed */}
                        {dewpointF !== null && <p>Dewpoint: {dewpointF}°F</p>}
                        {humidityValue !== null && <p>Humidity: {Math.round(humidityValue)}%</p>}
                        {windSpeed && <p>Wind: {windSpeed.replace(/[^0-9to\\s]/g, "")} {windDirection || ""}</p>}
                        {detailedForecast ? (
                            <p className="mt-1 leading-tight whitespace-pre-wrap">{detailedForecast}</p>
                        ) : (
                            <p className="mt-1 leading-tight">{shortForecast}</p> // Fallback to shortForecast if detailed is empty
                        )}
                    </div>
                    <span className="text-xxs text-gray-500 mt-auto pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">See Less</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Renders a horizontally scrollable list of hourly forecast cards.
 * Expects `data` to be an array of hourly period objects from NWS.
 * No section title here—WeatherDetails will render the "Hourly Forecast" header.
 * @param {{ data: Array }} props
 */
export default function HourlyForecast({ data }) {
    const nextHours = data.slice(0, 24); // Show up to 24 hours
    const scrollContainerRef = useRef(null);
    const [showScrollIndicators, setShowScrollIndicators] = useState({ left: false, right: false });

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const threshold = 5; // Increased threshold slightly
            setShowScrollIndicators({
                left: scrollLeft > threshold,
                right: scrollLeft < scrollWidth - clientWidth - threshold,
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScroll();
            container.addEventListener("scroll", checkScroll, { passive: true });
            window.addEventListener("resize", checkScroll);
            return () => {
                container.removeEventListener("scroll", checkScroll);
                window.removeEventListener("resize", checkScroll);
            };
        }
    }, [data]);

    const publicUrl = process.env.PUBLIC_URL || '';

    return (
        <div className="relative hourly-forecast-container">
            {showScrollIndicators.left && (
                <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-gradient-to-r from-gray-100 via-gray-100/80 to-transparent pointer-events-none z-10 flex items-center justify-start pl-1 sm:pl-2">
                    <img src={`${publicUrl}/weather-icons/arrow-left.svg`} alt="Scroll left" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 opacity-60" />
                </div>
            )}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-4 py-2 pb-4 hide-scrollbar"
                style={{ minHeight: '16rem' }} // Ensure container is tall enough for flipped cards
            >
                {nextHours.map((hour, index) => (
                    <HourlyCard key={hour.number || `hourly-${index}`} hour={hour} index={index} />
                ))}
            </div>
            {showScrollIndicators.right && (
                <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 bg-gradient-to-l from-gray-100 via-gray-100/80 to-transparent pointer-events-none z-10 flex items-center justify-end pr-1 sm:pr-2">
                    <img src={`${publicUrl}/weather-icons/arrow-right.svg`} alt="Scroll right" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 opacity-60" />
                </div>
            )}
        </div>
    );
}
