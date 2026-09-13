/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/magicmirror-current.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Convert normalized FMI observation and forecast data into the current
 * weather object expected by the built-in MagicMirror² weather module.
 *
 * Workflow:
 * 1. Validate the current FMI observation.
 * 2. Find the nearest usable HARMONIE WeatherSymbol3 value.
 * 3. Determine daylight state for the observation timestamp.
 * 4. Convert the FMI weather symbol to a MagicMirror² weather type.
 * 5. Calculate sunrise and sunset for the configured coordinates.
 * 6. Return the completed MagicMirror² current weather object.
 */

import {
    findNearestWeatherSymbol,
    mapFmiWeatherSymbol
} from "./magicmirror-weather.js";

import {
    getSolarTimes,
    isDaylight
} from "./solar.js";

/**
 * Build a MagicMirror² current weather object.
 *
 * Measured weather values come from the latest FMI observation. FMI surface
 * observations do not currently provide WeatherSymbol3, so the weather type
 * is derived from the temporally nearest usable HARMONIE forecast symbol.
 *
 * @param {object} observation Normalized current FMI observation.
 * @param {Array<object>} forecastTimeline Normalized FMI forecast timeline.
 * @param {number} latitude Latitude in decimal degrees.
 * @param {number} longitude Longitude in decimal degrees.
 * @returns {object|null} MagicMirror² current weather object, or null when
 * required weather data is unavailable.
 * @throws {TypeError} If the observation is invalid.
 */
export function buildCurrentWeatherObject(
    observation,
    forecastTimeline,
    latitude,
    longitude
) {
    if (
        observation === null ||
        typeof observation !== "object" ||
        Array.isArray(observation)
    ) {
        throw new TypeError("Observation must be an object");
    }

    if (typeof observation.time !== "string") {
        throw new TypeError(
            "Observation must contain a valid timestamp"
        );
    }

    const observationDate = new Date(observation.time);

    if (Number.isNaN(observationDate.getTime())) {
        throw new TypeError(
            "Observation must contain a valid timestamp"
        );
    }

        const requiredNumericFields = [
        "temperature",
        "humidity",
        "windDirection",
        "windSpeed"
    ];

    for (const field of requiredNumericFields) {
        if (
            typeof observation[field] !== "number" ||
            !Number.isFinite(observation[field])
        ) {
            return null;
        }
    }

    const weatherSymbol = findNearestWeatherSymbol(
        observation.time,
        forecastTimeline
    );

    if (weatherSymbol === null) {
        return null;
    }

    const daylight = isDaylight(
        latitude,
        longitude,
        observationDate
    );

    const weatherType = mapFmiWeatherSymbol(
        weatherSymbol,
        daylight
    );

    if (weatherType === null) {
        return null;
    }

    const { sunrise, sunset } = getSolarTimes(
        latitude,
        longitude,
        observationDate
    );

    return {
        humidity: observation.humidity,
        sunrise,
        sunset,
        temperature: observation.temperature,
        weatherType,
        windFromDirection: observation.windDirection,
        windSpeed: observation.windSpeed
    };
}