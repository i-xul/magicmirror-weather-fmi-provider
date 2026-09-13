/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/magicmirror-forecast.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Convert the normalized hourly FMI HARMONIE forecast timeline into daily
 * forecast objects expected by the built-in MagicMirror² weather module.
 *
 * Workflow:
 * 1. Convert forecast timestamps into the configured local time zone.
 * 2. Group hourly forecast entries by local calendar day.
 * 3. Calculate daily minimum and maximum temperatures.
 * 4. Sum hourly precipitation amounts for each local day.
 * 5. Select the supported weather symbol nearest to local noon.
 * 6. Return MagicMirror² forecast objects in chronological order.
 */

import {
    mapFmiWeatherSymbol
} from "./magicmirror-weather.js";

import {
    getLocalDateTimeParts
} from "./timezone.js";

/**
 * Return true when a value is a finite number.
 *
 * @param {*} value Value to inspect.
 * @returns {boolean} Whether the value is a finite number.
 */
function isFiniteNumber(value) {
    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );
}

/**
 * Find the supported weather symbol nearest to local noon.
 *
 * Daily forecast icons use the daytime MagicMirror² icon variant because
 * they represent the overall daytime forecast rather than a specific
 * nighttime observation.
 *
 * If two supported symbols are equally close to noon, the earlier forecast
 * timestamp is preferred for deterministic behaviour.
 *
 * @param {Array<object>} entries Forecast entries for one local day.
 * @param {string} timeZone IANA time-zone identifier.
 * @returns {{entry: object, weatherType: string}|null}
 *   Selected forecast entry and MagicMirror² weather type.
 */
function findRepresentativeWeather(entries, timeZone) {
    let bestCandidate = null;

    for (const entry of entries) {
        if (!isFiniteNumber(entry.weatherSymbol)) {
            continue;
        }

        const weatherType = mapFmiWeatherSymbol(
            entry.weatherSymbol,
            true
        );

        if (weatherType === null) {
            continue;
        }

        const local = getLocalDateTimeParts(
            entry.time,
            timeZone
        );

        const minutesFromNoon = Math.abs(
            (local.hour * 60 + local.minute) - (12 * 60)
        );

        const timestamp = new Date(entry.time).getTime();

        if (
            bestCandidate === null ||
            minutesFromNoon < bestCandidate.minutesFromNoon ||
            (
                minutesFromNoon === bestCandidate.minutesFromNoon &&
                timestamp < bestCandidate.timestamp
            )
        ) {
            bestCandidate = {
                entry,
                weatherType,
                minutesFromNoon,
                timestamp
            };
        }
    }

    if (bestCandidate === null) {
        return null;
    }

    return {
        entry: bestCandidate.entry,
        weatherType: bestCandidate.weatherType
    };
}

/**
 * Build MagicMirror² daily forecast objects from an FMI forecast timeline.
 *
 * The FMI HARMONIE forecast provides hourly values. Entries are grouped by
 * local calendar day using the explicitly configured IANA time zone.
 *
 * Daily precipitation is calculated by summing the normalized hourly
 * precipitation values from Precipitation1h.
 *
 * A day is omitted if it lacks any field required by MagicMirror²:
 * temperature data, precipitation data, or a supported weather symbol.
 *
 * @param {Array<object>} forecastTimeline Normalized FMI forecast timeline.
 * @param {string} timeZone IANA time-zone identifier.
 * @returns {Array<object>} MagicMirror² daily forecast objects.
 * @throws {TypeError} If forecastTimeline is not an array.
 */
export function buildDailyForecastObjects(
    forecastTimeline,
    timeZone
) {
    if (!Array.isArray(forecastTimeline)) {
        throw new TypeError(
            "Forecast timeline must be an array"
        );
    }

    /*
     * Validate the time zone even when the forecast timeline is empty.
     * This keeps configuration errors visible instead of silently returning
     * an empty forecast.
     */
    getLocalDateTimeParts(
        new Date(0),
        timeZone
    );

    const days = new Map();

    for (const entry of forecastTimeline) {
        if (
            entry === null ||
            typeof entry !== "object" ||
            Array.isArray(entry) ||
            typeof entry.time !== "string"
        ) {
            continue;
        }

        const timestamp = new Date(entry.time);

        if (Number.isNaN(timestamp.getTime())) {
            continue;
        }

        const local = getLocalDateTimeParts(
            timestamp,
            timeZone
        );

        if (!days.has(local.dateKey)) {
            days.set(local.dateKey, []);
        }

        days.get(local.dateKey).push(entry);
    }

    const forecast = [];

    for (const entries of days.values()) {
        const temperatures = entries
            .map((entry) => entry.temperature)
            .filter(isFiniteNumber);

        const precipitationValues = entries
            .map((entry) => entry.precipitation)
            .filter(
                (value) =>
                    isFiniteNumber(value) &&
                    value >= 0
            );

        if (
            temperatures.length === 0 ||
            precipitationValues.length === 0
        ) {
            continue;
        }

        const representativeWeather =
            findRepresentativeWeather(
                entries,
                timeZone
            );

        if (representativeWeather === null) {
            continue;
        }

        /*
         * Remove normal IEEE-754 floating-point summation artifacts while
         * preserving more precision than FMI precipitation data requires.
         */
        const precipitationAmount = Number(
            precipitationValues
                .reduce(
                    (sum, value) => sum + value,
                    0
                )
                .toPrecision(12)
        );

        forecast.push({
            /*
             * The representative timestamp is nearest to local noon, which
             * keeps the Date safely inside the intended local calendar day.
             */
            date: new Date(
                representativeWeather.entry.time
            ),
            maxTemperature: Math.max(...temperatures),
            minTemperature: Math.min(...temperatures),
            precipitationAmount,
            weatherType:
                representativeWeather.weatherType
        });
    }

    return forecast;
}