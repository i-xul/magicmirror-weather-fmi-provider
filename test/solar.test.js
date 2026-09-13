/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/solar.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify sunrise/sunset calculation, daylight detection, and validation
 * used by the MagicMirror² weather integration.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    getSolarTimes,
    isDaylight
} from "../src/solar.js";

const HELSINKI_LATITUDE = 60.1699;
const HELSINKI_LONGITUDE = 24.9384;

test("calculates sunrise and sunset as Date objects", () => {
    const date = new Date("2026-09-13T12:00:00Z");

    const { sunrise, sunset } = getSolarTimes(
        HELSINKI_LATITUDE,
        HELSINKI_LONGITUDE,
        date
    );

    assert.ok(sunrise instanceof Date);
    assert.ok(sunset instanceof Date);

    assert.ok(!Number.isNaN(sunrise.getTime()));
    assert.ok(!Number.isNaN(sunset.getTime()));

    assert.ok(sunrise < sunset);
});

test("detects daylight between sunrise and sunset", () => {
    const date = new Date("2026-09-13T12:00:00Z");

    assert.equal(
        isDaylight(
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE,
            date
        ),
        true
    );
});

test("detects night outside sunrise and sunset", () => {
    const date = new Date("2026-09-13T00:00:00Z");

    assert.equal(
        isDaylight(
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE,
            date
        ),
        false
    );
});

test("rejects invalid coordinates", () => {
    const date = new Date("2026-09-13T12:00:00Z");

    assert.throws(
        () => getSolarTimes("60.1699", 24.9384, date),
        TypeError
    );

    assert.throws(
        () => getSolarTimes(91, 24.9384, date),
        RangeError
    );

    assert.throws(
        () => getSolarTimes(60.1699, 181, date),
        RangeError
    );
});

test("rejects invalid dates", () => {
    assert.throws(
        () => getSolarTimes(
            HELSINKI_LATITUDE,
            HELSINKI_LONGITUDE,
            new Date("invalid")
        ),
        TypeError
    );
});

test("detects polar day when sunrise and sunset are unavailable", () => {
    const latitude = 69.9090;
    const longitude = 27.0288;
    const date = new Date("2026-06-21T00:00:00Z");

    const { sunrise, sunset } = getSolarTimes(
        latitude,
        longitude,
        date
    );

    assert.equal(sunrise, null);
    assert.equal(sunset, null);
    assert.equal(isDaylight(latitude, longitude, date), true);
});

test("detects polar night when sunrise and sunset are unavailable", () => {
    const latitude = 69.9090;
    const longitude = 27.0288;
    const date = new Date("2026-12-21T12:00:00Z");

    const { sunrise, sunset } = getSolarTimes(
        latitude,
        longitude,
        date
    );

    assert.equal(sunrise, null);
    assert.equal(sunset, null);
    assert.equal(isDaylight(latitude, longitude, date), false);
});
