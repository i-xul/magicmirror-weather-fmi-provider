/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/fmi-parser.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify that the FMI XML parser can read the saved Helsinki HARMONIE
 * forecast fixture and extract expected weather parameters.
 */

import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

import { parseFmiTimeValuePairXml } from "../src/fmi-parser.js";

const fixtureUrl = new URL(
    "./fixtures/fmi-helsinki-forecast.xml",
    import.meta.url
);

const xml = fs.readFileSync(fixtureUrl, "utf8");

test("parses FMI forecast parameters", () => {
    const data = parseFmiTimeValuePairXml(xml);

    assert.ok(data.has("Temperature"));
    assert.ok(data.has("Humidity"));
    assert.ok(data.has("WindDirection"));
    assert.ok(data.has("WindSpeedMS"));
    assert.ok(data.has("PrecipitationAmount"));
    assert.ok(data.has("TotalCloudCover"));
});

test("temperature contains time/value pairs", () => {
    const data = parseFmiTimeValuePairXml(xml);
    const temperatures = data.get("Temperature");

    assert.ok(Array.isArray(temperatures));
    assert.ok(temperatures.length > 0);

    assert.match(
        temperatures[0].time,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    assert.equal(typeof temperatures[0].value, "number");
});
