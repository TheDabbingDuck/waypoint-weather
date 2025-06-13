// src/components/Weather/HourlyForecast.jsx
import React, { useRef, useEffect, useState } from "react";
import { getWeatherIcon } from "../../utils/weatherIcons";

/**
 * Format a date string to a more readable time format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time (e.g., "2 PM (Today)" or "3 PM (Jun 13)")
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

    // Check if it's today, tomorrow, or another day
    if (date.toDateString() === now.toDateString()) {
        return `${timeFormatted} (Today)`;
    } else if (date.getDate() === now.getDate() + 1 &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear()) {
        return `${timeFormatted} (Tomorrow)`;
    } else {
        return `${timeFormatted} (${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
    }
}

/**
 * Renders a horizontally scrollable list of hourly forecast cards.
 * Expects `data` to be an array of hourly period objects from NWS.
 * No section title here—WeatherDetails will render the "Hourly Forecast" header.
 * @param {{ data: Array }} props
 */
export default function HourlyForecast({ data }) {
    const nextHours = data.slice(0, 12);
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
            >
                {nextHours.map((hour) => {
                    const {
                        number,
                        startTime,
                        temperature,
                        temperatureUnit,
                        windSpeed,
                        windDirection,
                        shortForecast,
                    } = hour;
                    const formattedTime = formatHourlyTime(startTime);
                    const weatherIcon = getWeatherIcon(shortForecast);
                    return (
                        <div
                            key={number}
                            className="flex-shrink-0 min-w-[8rem] sm:w-28 bg-white rounded-lg shadow-md p-3 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200"
                        >
                            <span className="text-sm font-medium mb-1">{formattedTime}</span>
                            <img
                                src={weatherIcon}
                                alt={shortForecast}
                                className="w-16 h-16 my-2"
                            />
                            <span className="text-lg font-semibold mt-1">
                                {temperature}°{temperatureUnit}
                            </span>
                            <span className="text-xs text-gray-600 mt-1">{shortForecast}</span>
                            {windSpeed && (
                                <span className="text-xs text-gray-500 mt-2">
                                    {windSpeed.replace(/[^0-9to ]/g, "")} {windDirection || ""}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            {showScrollIndicators.right && (
                <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 bg-gradient-to-l from-gray-100 via-gray-100/80 to-transparent pointer-events-none z-10 flex items-center justify-end pr-1 sm:pr-2">
                    <img src={`${publicUrl}/weather-icons/arrow-right.svg`} alt="Scroll right" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 opacity-60" />
                </div>
            )}
        </div>
    );
}
