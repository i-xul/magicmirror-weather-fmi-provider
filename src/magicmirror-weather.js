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

/**
 * Find the FMI WeatherSymbol3 value closest to an observation timestamp.
 *
 * Forecast entries without a numeric weather symbol or a valid timestamp are
 * ignored. If two valid forecast entries are equally close to the observation
 * time, the earlier forecast entry is preferred.
 *
 * A forecast symbol is accepted only when it is within 90 minutes of the
 * observation timestamp. This prevents stale or incomplete forecast data from
 * being presented as the current weather condition.
 *
 * @param {string} observationTime Observation timestamp in ISO 8601 format.
 * @param {Array<object>} forecastTimeline Normalized FMI forecast timeline.
 * @returns {number|null} Closest WeatherSymbol3 value, or null if unavailable.
 * @throws {TypeError} If the observation timestamp or forecast timeline is
 * invalid.
 */
export function findNearestWeatherSymbol(
    observationTime,
    forecastTimeline
) {
    const observationTimestamp = Date.parse(observationTime);

    if (Number.isNaN(observationTimestamp)) {
        throw new TypeError(
            "Observation time must be a valid ISO 8601 timestamp"
        );
    }

    if (!Array.isArray(forecastTimeline)) {
        throw new TypeError("Forecast timeline must be an array");
    }

    const maxDifferenceMs = 90 * 60 * 1000;

    let nearestSymbol = null;
    let nearestDifference = Infinity;
    let nearestTimestamp = Infinity;

    for (const entry of forecastTimeline) {
        if (
            entry === null ||
            typeof entry !== "object" ||
            typeof entry.weatherSymbol !== "number" ||
            !Number.isFinite(entry.weatherSymbol)
        ) {
            continue;
        }

        const forecastTimestamp = Date.parse(entry.time);

        if (Number.isNaN(forecastTimestamp)) {
            continue;
        }

        const difference = Math.abs(
            forecastTimestamp - observationTimestamp
        );

        if (
            difference <= maxDifferenceMs &&
            (
                difference < nearestDifference ||
                (
                    difference === nearestDifference &&
                    forecastTimestamp < nearestTimestamp
                )
            )
        ) {
            nearestSymbol = entry.weatherSymbol;
            nearestDifference = difference;
            nearestTimestamp = forecastTimestamp;
        }
    }

    return nearestSymbol;
}
