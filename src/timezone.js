/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/timezone.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Convert UTC weather timestamps into local calendar date and time values
 * using an explicit IANA time zone such as Europe/Helsinki.
 *
 * Workflow:
 * 1. Validate the input timestamp.
 * 2. Validate the requested IANA time zone.
 * 3. Convert the timestamp using Node.js Intl.DateTimeFormat.
 * 4. Return normalized local date/time components.
 */

/**
 * Validate an IANA time-zone identifier.
 *
 * Intl.DateTimeFormat throws RangeError for unsupported or invalid time-zone
 * identifiers, which provides a dependency-free validation mechanism.
 *
 * @param {string} timeZone IANA time-zone identifier.
 * @throws {TypeError} If timeZone is not a non-empty string.
 * @throws {RangeError} If timeZone is not supported.
 */
function validateTimeZone(timeZone) {
    if (
        typeof timeZone !== "string" ||
        timeZone.trim() === ""
    ) {
        throw new TypeError(
            "Time zone must be a non-empty string"
        );
    }

    new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone.trim()
    });
}

/**
 * Convert a timestamp into local date/time components.
 *
 * The returned dateKey uses YYYY-MM-DD format and is suitable for grouping
 * hourly forecast entries into local calendar days.
 *
 * @param {string|Date} timestamp ISO timestamp string or Date object.
 * @param {string} timeZone IANA time-zone identifier.
 * @returns {{
 *   dateKey: string,
 *   year: number,
 *   month: number,
 *   day: number,
 *   hour: number,
 *   minute: number,
 *   second: number
 * }} Local date/time components.
 * @throws {TypeError} If the timestamp is invalid.
 */
export function getLocalDateTimeParts(timestamp, timeZone) {
    validateTimeZone(timeZone);

    const date = timestamp instanceof Date
        ? new Date(timestamp.getTime())
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        throw new TypeError("Timestamp must be a valid date");
    }

    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone.trim(),
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });

    const parts = Object.fromEntries(
        formatter
            .formatToParts(date)
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value])
    );

    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);
    const hour = Number(parts.hour);
    const minute = Number(parts.minute);
    const second = Number(parts.second);

    return {
        dateKey: [
            parts.year,
            parts.month,
            parts.day
        ].join("-"),
        year,
        month,
        day,
        hour,
        minute,
        second
    };
}