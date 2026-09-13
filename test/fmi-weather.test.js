/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/fmi-weather.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify transformation of parsed FMI parameter series into a chronological
 * weather timeline suitable for later MagicMirror² integration.
 */

import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import { parseFmiTimeValuePairXml } from "../src/fmi-parser.js";
import { buildWeatherTimeline } from "../src/fmi-weather.js";

const fixtureUrl = new URL(
    "./fixtures/fmi-helsinki-forecast.xml",
    import.meta.url
);

const xml = fs.readFileSync(fixtureUrl, "utf8");

test("builds weather timeline from FMI parameter series", () => {
    const parameters = parseFmiTimeValuePairXml(xml);
    const timeline = buildWeatherTimeline(parameters);

    assert.ok(Array.isArray(timeline));
    assert.ok(timeline.length > 0);

    assert.equal(
        timeline[0].time,
        "2026-09-13T13:00:00Z"
    );

    assert.equal(timeline[0].temperature, 15.5);

    assert.equal(typeof timeline[0].humidity, "number");
    assert.equal(typeof timeline[0].windDirection, "number");
    assert.equal(typeof timeline[0].windSpeed, "number");
    assert.equal(typeof timeline[0].precipitation, "number");
    assert.equal(typeof timeline[0].cloudCover, "number");
});

test("weather timeline is chronologically sorted", () => {
    const parameters = parseFmiTimeValuePairXml(xml);
    const timeline = buildWeatherTimeline(parameters);

    for (let index = 1; index < timeline.length; index += 1) {
        const previous = new Date(timeline[index - 1].time);
        const current = new Date(timeline[index].time);

        assert.ok(current >= previous);
    }
});

test("includes additional supported FMI weather parameters", () => {
    const parameters = parseFmiTimeValuePairXml(xml);
    const timeline = buildWeatherTimeline(parameters);

    const first = timeline[0];

    assert.equal(typeof first.pressure, "number");
    assert.equal(typeof first.dewPoint, "number");
    assert.equal(typeof first.visibility, "number");
    assert.equal(typeof first.windGust, "number");
});

test("rejects invalid parameter input", () => {
    assert.throws(
        () => buildWeatherTimeline({}),
        {
            name: "TypeError",
            message: "FMI parameters must be provided as a Map"
        }
    );
});

test("maps FMI observation parameters to normalized weather fields", () => {
    const parameters = new Map([
        ["t2m", [
            { time: "2026-09-13T13:30:00Z", value: 15.6 }
        ]],
        ["rh", [
            { time: "2026-09-13T13:30:00Z", value: 89 }
        ]],
        ["wd_10min", [
            { time: "2026-09-13T13:30:00Z", value: 245 }
        ]],
        ["ws_10min", [
            { time: "2026-09-13T13:30:00Z", value: 2.9 }
        ]],
        ["wg_10min", [
            { time: "2026-09-13T13:30:00Z", value: 4.7 }
        ]],
        ["p_sea", [
            { time: "2026-09-13T13:30:00Z", value: 1011.6 }
        ]],
        ["vis", [
            { time: "2026-09-13T13:30:00Z", value: 30920 }
        ]],
        ["td", [
            { time: "2026-09-13T13:30:00Z", value: 13.7 }
        ]]
    ]);

    const timeline = buildWeatherTimeline(parameters);

    assert.equal(timeline.length, 1);

    assert.deepEqual(timeline[0], {
        time: "2026-09-13T13:30:00Z",
        temperature: 15.6,
        humidity: 89,
        windDirection: 245,
        windSpeed: 2.9,
        windGust: 4.7,
        pressure: 1011.6,
        visibility: 30920,
        dewPoint: 13.7
    });
});
