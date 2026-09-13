/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/magicmirror-weather.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify conversion from FMI WeatherSymbol3 values to weather type names
 * understood by the built-in MagicMirror² weather module.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    mapFmiWeatherSymbol
} from "../src/magicmirror-weather.js";

test("maps clear and partly cloudy symbols for day and night", () => {
    assert.equal(
        mapFmiWeatherSymbol(1, true),
        "day-sunny"
    );
    assert.equal(
        mapFmiWeatherSymbol(1, false),
        "night-clear"
    );

    assert.equal(
        mapFmiWeatherSymbol(2, true),
        "day-cloudy"
    );
    assert.equal(
        mapFmiWeatherSymbol(2, false),
        "night-alt-cloudy"
    );

    assert.equal(
        mapFmiWeatherSymbol(3, true),
        "cloudy"
    );
    assert.equal(
        mapFmiWeatherSymbol(3, false),
        "cloudy"
    );
});

test("maps FMI rain shower symbols for day and night", () => {
    for (const symbol of [21, 22, 23]) {
        assert.equal(
            mapFmiWeatherSymbol(symbol, true),
            "day-showers"
        );
        assert.equal(
            mapFmiWeatherSymbol(symbol, false),
            "night-alt-showers"
        );
    }
});

test("maps FMI continuous rain symbols for day and night", () => {
    for (const symbol of [31, 32, 33]) {
        assert.equal(
            mapFmiWeatherSymbol(symbol, true),
            "day-rain"
        );
        assert.equal(
            mapFmiWeatherSymbol(symbol, false),
            "night-alt-rain"
        );
    }
});

test("maps FMI snow symbols for day and night", () => {
    for (const symbol of [41, 42, 43, 51, 52, 53]) {
        assert.equal(
            mapFmiWeatherSymbol(symbol, true),
            "day-snow"
        );
        assert.equal(
            mapFmiWeatherSymbol(symbol, false),
            "night-alt-snow"
        );
    }
});

test("maps FMI thunderstorm symbols for day and night", () => {
    for (const symbol of [61, 62, 63, 64]) {
        assert.equal(
            mapFmiWeatherSymbol(symbol, true),
            "day-thunderstorm"
        );
        assert.equal(
            mapFmiWeatherSymbol(symbol, false),
            "night-alt-thunderstorm"
        );
    }
});

test("returns null for unsupported FMI weather symbols", () => {
    assert.equal(mapFmiWeatherSymbol(0, true), null);
    assert.equal(mapFmiWeatherSymbol(999, false), null);
    assert.equal(mapFmiWeatherSymbol(null, true), null);
});

test("requires daylight information", () => {
    assert.throws(
        () => mapFmiWeatherSymbol(1),
        TypeError
    );

    assert.throws(
        () => mapFmiWeatherSymbol(1, null),
        TypeError
    );

    assert.throws(
        () => mapFmiWeatherSymbol(1, "day"),
        TypeError
    );
});