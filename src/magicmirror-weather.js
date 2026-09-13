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
 * Daylight information is supplied by the caller so this mapper remains
 * independent of geographic coordinates and astronomical calculations.
 *
 * @param {number} weatherSymbol FMI WeatherSymbol3 value.
 * @param {boolean} daylight True when the sun is at or above the horizon.
 * @returns {string|null} MagicMirror² weather type, or null if unsupported.
 * @throws {TypeError} If daylight is not a boolean.
 */
export function mapFmiWeatherSymbol(weatherSymbol, daylight) {
    if (typeof daylight !== "boolean") {
        throw new TypeError("Daylight must be a boolean");
    }

    switch (weatherSymbol) {
        case 1:
            return daylight ? "day-sunny" : "night-clear";

        case 2:
            return daylight ? "day-cloudy" : "night-alt-cloudy";

        case 3:
            return "cloudy";

        case 21:
        case 22:
        case 23:
            return daylight ? "day-showers" : "night-alt-showers";

        case 31:
        case 32:
        case 33:
            return daylight ? "day-rain" : "night-alt-rain";

        case 41:
        case 42:
        case 43:
        case 51:
        case 52:
        case 53:
            return daylight ? "day-snow" : "night-alt-snow";

        case 61:
        case 62:
        case 63:
        case 64:
            return daylight
                ? "day-thunderstorm"
                : "night-alt-thunderstorm";

        default:
            return null;
    }
}