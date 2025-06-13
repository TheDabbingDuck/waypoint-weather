// src/utils/weatherIcons.js

/**
 * Maps NWS forecast descriptions to modern weather icons
 * Using free icons from Weather Icons (https://erikflowers.github.io/weather-icons/)
 *
 * @param {string} description - The NWS forecast description
 * @returns {string} URL to a weather icon
 */
export function getWeatherIcon(description) {
  const publicUrl = process.env.PUBLIC_URL || '';
  if (!description) return `${publicUrl}/weather-icons/unknown.svg`;

  const desc = description.toLowerCase();

  // Clear conditions
  if (desc.includes('sunny') || desc.includes('clear')) {
    return `${publicUrl}/weather-icons/clear-day.svg`;
  }

  // Cloudy conditions
  if (desc.includes('cloudy') || desc.includes('overcast')) {
    if (desc.includes('partly') || desc.includes('mostly sunny')) {
      return `${publicUrl}/weather-icons/partly-cloudy-day.svg`;
    }
    return `${publicUrl}/weather-icons/cloudy.svg`;
  }

  // Rain conditions
  if (desc.includes('rain') || desc.includes('shower')) {
    if (desc.includes('light') || desc.includes('drizzle')) {
      return `${publicUrl}/weather-icons/drizzle.svg`;
    }
    if (desc.includes('thunder') || desc.includes('tstm')) {
      return `${publicUrl}/weather-icons/thunderstorms-rain.svg`;
    }
    return `${publicUrl}/weather-icons/rain.svg`;
  }

  // Snow conditions
  if (desc.includes('snow') || desc.includes('flurries')) {
    if (desc.includes('light')) {
      return `${publicUrl}/weather-icons/snow.svg`;
    }
    if (desc.includes('heavy')) {
      return `${publicUrl}/weather-icons/snow.svg`;
    }
    return `${publicUrl}/weather-icons/snow.svg`;
  }

  // Mixed precipitation
  if (desc.includes('sleet') || desc.includes('freezing rain') || desc.includes('wintry mix')) {
    return `${publicUrl}/weather-icons/sleet.svg`;
  }

  // Fog/Haze
  if (desc.includes('fog') || desc.includes('haze') || desc.includes('mist')) {
    return `${publicUrl}/weather-icons/fog.svg`;
  }

  // Wind
  if (desc.includes('wind') || desc.includes('breezy') || desc.includes('blustery')) {
    return `${publicUrl}/weather-icons/wind.svg`;
  }

  // Fallback
  return `${publicUrl}/weather-icons/cloudy.svg`;
}

/**
 * Get a suitable background color class based on weather conditions
 * @param {string} description - The weather description
 * @param {number} temperature - Temperature in Fahrenheit
 * @returns {string} Tailwind CSS class for background color
 */
export function getWeatherBackgroundClass(description, temperature) {
  if (!description) return 'bg-blue-50';

  const desc = description.toLowerCase();

  // Hot temperatures
  if (temperature > 85) {
    return 'bg-orange-50';
  }

  // Cold temperatures
  if (temperature < 32) {
    return 'bg-blue-100';
  }

  // Rain/storms
  if (desc.includes('rain') || desc.includes('shower') ||
      desc.includes('thunder') || desc.includes('tstm')) {
    return 'bg-slate-100';
  }

  // Snow/winter
  if (desc.includes('snow') || desc.includes('sleet') ||
      desc.includes('freezing') || desc.includes('wintry')) {
    return 'bg-blue-50';
  }

  // Clear/sunny days
  if (desc.includes('sunny') || desc.includes('clear')) {
    return 'bg-yellow-50';
  }

  // Cloudy days
  if (desc.includes('cloudy') || desc.includes('overcast')) {
    return 'bg-gray-100';
  }

  // Fog/mist
  if (desc.includes('fog') || desc.includes('haze') || desc.includes('mist')) {
    return 'bg-gray-200';
  }

  return 'bg-blue-50'; // Default
}
