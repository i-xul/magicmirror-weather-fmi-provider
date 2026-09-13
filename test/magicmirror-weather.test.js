/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/magicmirror-weather.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify conversion of FMI WeatherSymbol3 values into weather type names
 * understood by the built-in MagicMirror² weather module.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { mapFmiWeatherSymbol } from "../src/magicmirror-weather.js";

test("maps clear and cloudy FMI weather symbols", () => {
    assert.equal(mapFmiWeatherSymbol(1), "day-sunny");
    assert.equal(mapFmiWeatherSymbol(2), "day-cloudy");
    assert.equal(mapFmiWeatherSymbol(3), "cloudy");
});

test("maps FMI rain shower symbols", () => {
    assert.equal(mapFmiWeatherSymbol(21), "showers");
    assert.equal(mapFmiWeatherSymbol(22), "showers");
    assert.equal(mapFmiWeatherSymbol(23), "showers");
});

test("maps FMI continuous rain symbols", () => {
    assert.equal(mapFmiWeatherSymbol(31), "rain");
    assert.equal(mapFmiWeatherSymbol(32), "rain");
    assert.equal(mapFmiWeatherSymbol(33), "rain");
});

test("maps FMI snow symbols", () => {
    assert.equal(mapFmiWeatherSymbol(41), "snow");
    assert.equal(mapFmiWeatherSymbol(42), "snow");
    assert.equal(mapFmiWeatherSymbol(43), "snow");
    assert.equal(mapFmiWeatherSymbol(51), "snow");
    assert.equal(mapFmiWeatherSymbol(52), "snow");
    assert.equal(mapFmiWeatherSymbol(53), "snow");
});

test("maps FMI thunderstorm symbols", () => {
    assert.equal(mapFmiWeatherSymbol(61), "thunderstorm");
    assert.equal(mapFmiWeatherSymbol(62), "thunderstorm");
    assert.equal(mapFmiWeatherSymbol(63), "thunderstorm");
    assert.equal(mapFmiWeatherSymbol(64), "thunderstorm");
});

test("returns null for unsupported FMI weather symbols", () => {
    assert.equal(mapFmiWeatherSymbol(0), null);
    assert.equal(mapFmiWeatherSymbol(999), null);
    assert.equal(mapFmiWeatherSymbol(null), null);
});