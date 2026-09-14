/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/fmi-live.integration.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify the complete live FMI forecast pipeline using the real FMI WFS
 * service.
 *
 * Workflow:
 * 1. Fetch a live HARMONIE point forecast from FMI.
 * 2. Parse the returned XML.
 * 3. Build the normalized weather timeline.
 * 4. Verify that current forecast data contains expected fields.
 *
 * Note:
 * This is an integration test and requires network access. It is not intended
 * to run as part of the default deterministic unit-test suite.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    fetchFmiForecast,
    fetchFmiObservations
} from "../src/fmi-client.js";
import { parseFmiTimeValuePairXml } from "../src/fmi-parser.js";
import { buildWeatherTimeline } from "../src/fmi-weather.js";

test("fetches and transforms live FMI forecast", async () => {
    const xml = await fetchFmiForecast("Helsinki");

    assert.equal(typeof xml, "string");
    assert.ok(xml.length > 0);

    const parameters = parseFmiTimeValuePairXml(xml);

    assert.ok(parameters.has("Temperature"));
    assert.ok(parameters.has("Humidity"));
    assert.ok(parameters.has("WindSpeedMS"));
    assert.ok(parameters.has("WeatherSymbol3"));

    const timeline = buildWeatherTimeline(parameters);

    assert.ok(Array.isArray(timeline));
    assert.ok(timeline.length > 0);

    const first = timeline[0];

    assert.match(
        first.time,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    assert.equal(typeof first.temperature, "number");
    assert.equal(typeof first.humidity, "number");
    assert.equal(typeof first.windSpeed, "number");
    assert.equal(typeof first.weatherSymbol, "number");
});

test("fetches and transforms live FMI observations", async () => {
    const xml = await fetchFmiObservations("Helsinki");

    assert.equal(typeof xml, "string");
    assert.ok(xml.length > 0);

    const parameters = parseFmiTimeValuePairXml(xml);

    assert.ok(parameters.size > 0);

    const timeline = buildWeatherTimeline(parameters);

    assert.ok(Array.isArray(timeline));
    assert.ok(timeline.length > 0);

    const latest = timeline.at(-1);

    assert.match(
        latest.time,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
});
