/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/magicmirror-forecast.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify conversion of normalized hourly FMI forecast data into daily
 * forecast objects expected by the MagicMirror² weather module.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    buildDailyForecastObjects
} from "../src/magicmirror-forecast.js";

test("builds daily MagicMirror forecast objects", () => {
    const timeline = [
        {
            time: "2026-09-14T06:00:00Z",
            temperature: 10,
            precipitation: 0.2,
            weatherSymbol: 3
        },
        {
            time: "2026-09-14T09:00:00Z",
            temperature: 15,
            precipitation: 0.4,
            weatherSymbol: 2
        },
        {
            time: "2026-09-14T12:00:00Z",
            temperature: 17,
            precipitation: 0.1,
            weatherSymbol: 1
        },
        {
            time: "2026-09-14T18:00:00Z",
            temperature: 12,
            precipitation: 0,
            weatherSymbol: 3
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    assert.equal(forecast.length, 1);

    assert.deepEqual(forecast[0], {
        /*
         * 09:00 UTC is 12:00 local Helsinki summer time and therefore the
         * representative timestamp nearest to local noon.
         */
        date: new Date("2026-09-14T09:00:00Z"),
        maxTemperature: 17,
        minTemperature: 10,
        precipitationAmount: 0.7,
        weatherType: "day-cloudy"
    });
});

test("groups forecast entries by local calendar day", () => {
    const timeline = [
        {
            /*
             * 20:00 UTC = 23:00 local on September 13.
             */
            time: "2026-09-13T20:00:00Z",
            temperature: 13,
            precipitation: 0.1,
            weatherSymbol: 1
        },
        {
            /*
             * 21:00 UTC = 00:00 local on September 14.
             */
            time: "2026-09-13T21:00:00Z",
            temperature: 11,
            precipitation: 0.2,
            weatherSymbol: 2
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    assert.equal(forecast.length, 2);

    assert.equal(forecast[0].minTemperature, 13);
    assert.equal(forecast[0].maxTemperature, 13);

    assert.equal(forecast[1].minTemperature, 11);
    assert.equal(forecast[1].maxTemperature, 11);
});

test("selects weather symbol nearest to local noon", () => {
    const timeline = [
        {
            time: "2026-09-14T06:00:00Z",
            temperature: 10,
            precipitation: 0,
            weatherSymbol: 3
        },
        {
            /*
             * 08:00 UTC = 11:00 local.
             */
            time: "2026-09-14T08:00:00Z",
            temperature: 14,
            precipitation: 0,
            weatherSymbol: 2
        },
        {
            /*
             * 10:00 UTC = 13:00 local.
             */
            time: "2026-09-14T10:00:00Z",
            temperature: 16,
            precipitation: 0,
            weatherSymbol: 31
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    /*
     * 11:00 and 13:00 are equally close to noon. The earlier timestamp
     * wins deterministically.
     */
    assert.equal(
        forecast[0].weatherType,
        "day-cloudy"
    );

    assert.equal(
        forecast[0].date.getTime(),
        new Date("2026-09-14T08:00:00Z").getTime()
    );
});

test("sums hourly precipitation for the local day", () => {
    const timeline = [
        {
            time: "2026-09-14T07:00:00Z",
            temperature: 10,
            precipitation: 0.25,
            weatherSymbol: 31
        },
        {
            time: "2026-09-14T08:00:00Z",
            temperature: 11,
            precipitation: 1.5,
            weatherSymbol: 31
        },
        {
            time: "2026-09-14T09:00:00Z",
            temperature: 12,
            precipitation: 0.75,
            weatherSymbol: 31
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    assert.equal(
        forecast[0].precipitationAmount,
        2.5
    );
});

test("ignores unsupported symbols when choosing daily weather type", () => {
    const timeline = [
        {
            /*
             * Closest to noon, but unsupported.
             */
            time: "2026-09-14T09:00:00Z",
            temperature: 15,
            precipitation: 0,
            weatherSymbol: 999
        },
        {
            time: "2026-09-14T08:00:00Z",
            temperature: 14,
            precipitation: 0,
            weatherSymbol: 1
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    assert.equal(forecast.length, 1);
    assert.equal(
        forecast[0].weatherType,
        "day-sunny"
    );
});

test("omits days without required forecast values", () => {
    const timeline = [
        {
            time: "2026-09-14T09:00:00Z",
            temperature: 15,
            weatherSymbol: 1
        },
        {
            time: "2026-09-15T09:00:00Z",
            precipitation: 0,
            weatherSymbol: 1
        },
        {
            time: "2026-09-16T09:00:00Z",
            temperature: 14,
            precipitation: 0,
            weatherSymbol: 999
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    assert.deepEqual(forecast, []);
});

test("skips malformed forecast entries", () => {
    const timeline = [
        null,
        [],
        {},
        {
            time: "not-a-date",
            temperature: 99,
            precipitation: 99,
            weatherSymbol: 1
        },
        {
            time: "2026-09-14T09:00:00Z",
            temperature: 15,
            precipitation: 0,
            weatherSymbol: 1
        }
    ];

    const forecast = buildDailyForecastObjects(
        timeline,
        "Europe/Helsinki"
    );

    assert.equal(forecast.length, 1);
    assert.equal(forecast[0].maxTemperature, 15);
});

test("rejects invalid forecast timeline input", () => {
    assert.throws(
        () => buildDailyForecastObjects(
            {},
            "Europe/Helsinki"
        ),
        {
            name: "TypeError",
            message: "Forecast timeline must be an array"
        }
    );
});

test("rejects invalid time-zone configuration", () => {
    assert.throws(
        () => buildDailyForecastObjects(
            [],
            ""
        ),
        {
            name: "TypeError",
            message: "Time zone must be a non-empty string"
        }
    );

    assert.throws(
        () => buildDailyForecastObjects(
            [],
            "Invalid/TimeZone"
        ),
        RangeError
    );
});