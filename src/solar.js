/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/solar.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Calculate sunrise and sunset times for MagicMirror² weather data and
 * determine whether a specific timestamp occurs during daylight.
 *
 * Workflow:
 * 1. Validate coordinates and the requested date.
 * 2. Calculate sunrise and sunset using sunrise-sunset-js.
 * 3. Return the solar times as JavaScript Date objects.
 * 4. Determine whether a timestamp falls between sunrise and sunset.
 *
 * Notes:
 * sunrise-sunset-js may return null for sunrise or sunset at high latitudes
 * during polar day or polar night. Callers must therefore handle unavailable
 * solar events explicitly.
 */

import {
    getSolarPosition,
    getSunrise,
    getSunset
} from "sunrise-sunset-js";

/**
 * Validate geographic coordinates.
 *
 * @param {number} latitude Latitude in decimal degrees.
 * @param {number} longitude Longitude in decimal degrees.
 * @throws {TypeError|RangeError} If coordinates are invalid.
 */
function validateCoordinates(latitude, longitude) {
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new TypeError(
            "Latitude and longitude must be finite numbers"
        );
    }

    if (latitude < -90 || latitude > 90) {
        throw new RangeError(
            "Latitude must be between -90 and 90 degrees"
        );
    }

    if (longitude < -180 || longitude > 180) {
        throw new RangeError(
            "Longitude must be between -180 and 180 degrees"
        );
    }
}

/**
 * Validate a JavaScript Date object.
 *
 * @param {Date} date Date to validate.
 * @throws {TypeError} If the value is not a valid Date.
 */
function validateDate(date) {
    if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime())
    ) {
        throw new TypeError("Date must be a valid Date object");
    }
}

/**
 * Calculate sunrise and sunset for a geographic location.
 *
 * @param {number} latitude Latitude in decimal degrees.
 * @param {number} longitude Longitude in decimal degrees.
 * @param {Date} date Date for which solar times are calculated.
 * @returns {{sunrise: Date|null, sunset: Date|null}} Solar event times.
 */
export function getSolarTimes(latitude, longitude, date = new Date()) {
    validateCoordinates(latitude, longitude);
    validateDate(date);

    return {
        sunrise: getSunrise(latitude, longitude, date),
        sunset: getSunset(latitude, longitude, date)
    };
}

/**
 * Determine whether the sun is above the horizon at a specific timestamp.
 *
 * Solar elevation is used instead of comparing sunrise and sunset times.
 * This also handles polar day and polar night correctly when sunrise and
 * sunset events do not occur.
 *
 * @param {number} latitude Latitude in decimal degrees.
 * @param {number} longitude Longitude in decimal degrees.
 * @param {Date} date Timestamp to evaluate.
 * @returns {boolean} True when the sun is at or above the horizon.
 */
export function isDaylight(latitude, longitude, date = new Date()) {
    validateCoordinates(latitude, longitude);
    validateDate(date);

    const { elevation } = getSolarPosition(
        latitude,
        longitude,
        date
    );

    return elevation >= 0;
}