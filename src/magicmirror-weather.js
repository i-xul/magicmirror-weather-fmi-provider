/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/magicmirror-weather.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Convert FMI-specific weather symbols into weather type names understood
 * by the built-in MagicMirror² weather module.
 *
 * Workflow:
 * 1. Receive an FMI WeatherSymbol3 value.
 * 2. Group related FMI weather conditions.
 * 3. Return the corresponding MagicMirror² Weather Icons name.
 *
 * Notes:
 * MagicMirror² adds the "wi-" CSS prefix itself. This mapper therefore
 * returns values such as "rain" and "day-sunny", not "wi-rain" or
 * "wi-day-sunny".
 */

/**
 * Convert an FMI WeatherSymbol3 value to a MagicMirror² weather type.
 *
 * Day/night-specific handling for clear and partly cloudy conditions will
 * be added separately once sunrise and sunset data are available.
 *
 * @param {number} weatherSymbol FMI WeatherSymbol3 value.
 * @returns {string|null} MagicMirror² weather type, or null if unsupported.
 */
export function mapFmiWeatherSymbol(weatherSymbol) {
    switch (weatherSymbol) {
        case 1:
            return "day-sunny";

        case 2:
            return "day-cloudy";

        case 3:
            return "cloudy";

        case 21:
        case 22:
        case 23:
            return "showers";

        case 31:
        case 32:
        case 33:
            return "rain";

        case 41:
        case 42:
        case 43:
        case 51:
        case 52:
        case 53:
            return "snow";

        case 61:
        case 62:
        case 63:
        case 64:
            return "thunderstorm";

        default:
            return null;
    }
}