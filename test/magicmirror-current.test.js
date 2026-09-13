/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/magicmirror-current.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify conversion of normalized FMI observation and forecast data into
 * the current weather object expected by the built-in MagicMirror² weather
 * module.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    buildCurrentWeatherObject
} from "../src/magicmirror-current.js";

const HELSINKI_LATITUDE = 60.1699;
const HELSINKI_LONGITUDE = 24.9384;

const observation = {
    time: "2026-09-13T12:00:00Z",
    temperature: 15.6,
    humidity: 89,
    windDirection: 245,
    windSpeed: 2.9
};

test("builds MagicMirror current weather object", () => {
    const forecastTimeline = [
        {
            time: "2026-09-13T11:00:00Z",
            weatherSymbol: 1
        },
        {
            time: "2026-09-13T12:00:00Z",
            weatherSymbol: 2
        },
        {
            time: "2026-09-13T13:00:00Z",
            weatherSymbol: 3
        }
    ];

    const current = buildCurrentWeatherObject(
        observation,
        forecastTimeline,
        HELSINKI_LATITUDE,
        HELSINKI_LONGITUDE
    );

    assert.deepEqual(
        {
            humidity: current.humidity,
            temperature: current.temperature,
            weatherType: current.weatherType,
            windFromDirection: current.windFromDirection,
            windSpeed: current.windSpeed
        },
        {
            humidity: 89,
            temperature: 15.6,
            weatherType: "day-cloudy",
            windFromDirection: 245,
            windSpeed: 2.9
        }
    );

    assert.ok(current.sunrise instanceof Date);
    assert.ok(current.sunset instanceof Date);
});

test("uses night weather type during nighttime", () => {
    const nightObservation = {
        ...observation,
        time: "2026-09-13T00:00:00Z"
    };

    const forecastTimeline = [
        {
            time: "2026-09-13T00:00:00Z",
            weatherSymbol: 1
        }
    ];

    const current = buildCurrentWeatherObject(
        nightObservation,
        forecastTimeline,
        HELSINKI_LATITUDE,
        HELSINKI_LONGITUDE
    );

    assert.equal(current.weatherType, "night-clear");
});

test("returns null when no nearby weather symbol is available", () => {
    const forecastTimeline = [
        {
            time: "2026-09-13T06:00:00Z",
            weatherSymbol: 1
        }
    ];

    assert.equal(
        buildCurrentWeatherObject(
            observation,
            forecastTimeline,
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        null
    );
});

test("returns null for unsupported FMI weather symbol", () => {
    const forecastTimeline = [
        {
            time: observation.time,
            weatherSymbol: 999
        }
    ];

    assert.equal(
        buildCurrentWeatherObject(
            observation,
            forecastTimeline,
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        null
    );
});

test("rejects invalid observations", () => {
    assert.throws(
        () => buildCurrentWeatherObject(
            null,
            [],
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        TypeError
    );

    assert.throws(
        () => buildCurrentWeatherObject(
            [],
            [],
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        TypeError
    );

    assert.throws(
        () => buildCurrentWeatherObject(
            {},
            [],
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        TypeError
    );

    assert.throws(
        () => buildCurrentWeatherObject(
            { time: "invalid" },
            [],
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        TypeError
    );
});

test("returns null when required observation values are missing", () => {
    const forecastTimeline = [
        {
            time: observation.time,
            weatherSymbol: 1
        }
    ];

    assert.equal(
        buildCurrentWeatherObject(
            {
                ...observation,
                humidity: undefined
            },
            forecastTimeline,
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        null
    );

    assert.equal(
        buildCurrentWeatherObject(
            {
                ...observation,
                windSpeed: Number.NaN
            },
            forecastTimeline,
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE
        ),
        null
    );
});

test("rejects invalid coordinates", () => {
    const forecastTimeline = [
        {
            time: observation.time,
            weatherSymbol: 1
        }
    ];

    assert.throws(
        () => buildCurrentWeatherObject(
            observation,
            forecastTimeline,
            91,
            HELSINKI_LONGITUDE
        ),
        RangeError
    );

    assert.throws(
        () => buildCurrentWeatherObject(
            observation,
            forecastTimeline,
            HELSINKI_LATITUDE,
            181
        ),
        RangeError
    );
});

test("supports polar day without sunrise or sunset events", () => {
    const polarObservation = {
        ...observation,
        time: "2026-06-21T00:00:00Z"
    };

    const forecastTimeline = [
        {
            time: polarObservation.time,
            weatherSymbol: 1
        }
    ];

    const current = buildCurrentWeatherObject(
        polarObservation,
        forecastTimeline,
        69.9090,
        27.0288
    );

    assert.equal(current.weatherType, "day-sunny");
    assert.equal(current.sunrise, null);
    assert.equal(current.sunset, null);
});

test("supports polar night without sunrise or sunset events", () => {
    const polarObservation = {
        ...observation,
        time: "2026-12-21T12:00:00Z"
    };

    const forecastTimeline = [
        {
            time: polarObservation.time,
            weatherSymbol: 1
        }
    ];

    const current = buildCurrentWeatherObject(
        polarObservation,
        forecastTimeline,
        69.9090,
        27.0288
    );

    assert.equal(current.weatherType, "night-clear");
    assert.equal(current.sunrise, null);
    assert.equal(current.sunset, null);
});