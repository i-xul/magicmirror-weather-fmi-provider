/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/magicmirror-service.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Provide a high-level service that converts FMI observations and forecasts
 * into weather objects ready for the built-in MagicMirror² weather module.
 *
 * Workflow:
 * 1. Fetch the latest complete FMI weather observation.
 * 2. Fetch the FMI HARMONIE forecast timeline.
 * 3. Build the MagicMirror² current weather object.
 * 4. Build timezone-aware daily forecast objects.
 * 5. Return both datasets as one result.
 */

import {
    getCurrentWeather,
    getForecast
} from "./fmi-service.js";

import {
    buildCurrentWeatherObject
} from "./magicmirror-current.js";

import {
    buildDailyForecastObjects
} from "./magicmirror-forecast.js";

/**
 * Convert normalized FMI weather data into MagicMirror² weather objects.
 *
 * Keeping this transformation separate from the network requests makes the
 * provider logic deterministic and easy to test.
 *
 * @param {object|null} observation Latest complete normalized FMI observation.
 * @param {object[]} forecastTimeline Normalized FMI forecast timeline.
 * @param {number} latitude Forecast location latitude.
 * @param {number} longitude Forecast location longitude.
 * @param {string} timeZone IANA time zone such as Europe/Helsinki.
 * @returns {{current: object|null, forecast: object[]}}
 * MagicMirror²-compatible weather data.
 */
export function buildMagicMirrorWeatherData(
    observation,
    forecastTimeline,
    latitude,
    longitude,
    timeZone
) {
    const current = observation === null
        ? null
        : buildCurrentWeatherObject(
            observation,
            forecastTimeline,
            latitude,
            longitude
        );

    const forecast = buildDailyForecastObjects(
        forecastTimeline,
        timeZone
    );

    return {
        current,
        forecast
    };
}

/**
 * Fetch FMI weather data and convert it into MagicMirror² weather objects.
 *
 * Observation and forecast requests are independent, so they are fetched in
 * parallel to avoid unnecessary waiting between network requests.
 *
 * @param {object} config Provider weather configuration.
 * @param {string} config.place FMI place name.
 * @param {number} config.latitude Geographic latitude.
 * @param {number} config.longitude Geographic longitude.
 * @param {string} config.timeZone IANA time zone.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<{current: object|null, forecast: object[]}>}
 * MagicMirror²-compatible weather data.
 */
export async function getMagicMirrorWeather(
    config,
    fetchImpl = fetch
) {
    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        throw new TypeError(
            "MagicMirror weather configuration must be an object"
        );
    }

    const {
        place,
        latitude,
        longitude,
        timeZone,
        type
    } = config;

    /*
     * Forecast and daily MagicMirror instances need only FMI forecast data.
     * Avoid fetching observations for these provider types because the
     * observation response would never be used.
     */
    if (
        type === "forecast" ||
        type === "daily"
    ) {
        const forecastTimeline =
            await getForecast(
                place,
                fetchImpl
            );

        return buildMagicMirrorWeatherData(
            null,
            forecastTimeline,
            latitude,
            longitude,
            timeZone
        );
    }

    /*
     * Current weather still needs both datasets:
     *
     * - observations provide the measured current values
     * - forecast data provides WeatherSymbol3 for the current weather icon
     *
     * Keep the requests parallel because neither depends on the other.
     */
    const [
        observation,
        forecastTimeline
    ] = await Promise.all([
        getCurrentWeather(
            place,
            fetchImpl
        ),
        getForecast(
            place,
            fetchImpl
        )
    ]);

    return buildMagicMirrorWeatherData(
        observation,
        forecastTimeline,
        latitude,
        longitude,
        timeZone
    );
}