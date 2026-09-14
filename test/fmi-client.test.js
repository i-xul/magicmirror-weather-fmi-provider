/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/fmi-client.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify FMI request URL construction and HTTP response handling without
 * requiring live network access during the normal test suite.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    buildFmiForecastUrl,
    buildFmiObservationUrl,
    fetchFmiForecast,
    fetchFmiObservations
} from "../src/fmi-client.js";

test("builds FMI HARMONIE point forecast URL", () => {
    const url = buildFmiForecastUrl("Helsinki");

    assert.equal(url.origin, "https://opendata.fmi.fi");
    assert.equal(url.pathname, "/wfs");
    assert.equal(url.searchParams.get("service"), "WFS");
    assert.equal(url.searchParams.get("version"), "2.0.0");
    assert.equal(url.searchParams.get("request"), "getFeature");

    assert.equal(
        url.searchParams.get("storedquery_id"),
        "fmi::forecast::harmonie::surface::point::timevaluepair"
    );

    assert.equal(url.searchParams.get("place"), "Helsinki");

    const parameters = url.searchParams
        .get("parameters")
        .split(",");

    assert.ok(parameters.includes("Precipitation1h"));
    assert.ok(parameters.includes("WeatherSymbol3"));
    assert.ok(!parameters.includes("PrecipitationAmount"));
});

test("trims FMI place names", () => {
    const url = buildFmiForecastUrl("  Helsinki  ");

    assert.equal(url.searchParams.get("place"), "Helsinki");
});

test("rejects invalid FMI place names", () => {
    assert.throws(
        () => buildFmiForecastUrl(""),
        {
            name: "TypeError",
            message: "FMI place must be a non-empty string"
        }
    );

    assert.throws(
        () => buildFmiForecastUrl("   "),
        {
            name: "TypeError",
            message: "FMI place must be a non-empty string"
        }
    );
});

test("returns XML from successful FMI response", async () => {
    const expectedXml = "<FeatureCollection />";

    const fakeFetch = async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => expectedXml
    });

    const xml = await fetchFmiForecast("Helsinki", fakeFetch);

    assert.equal(xml, expectedXml);
});

test("throws after retryable FMI responses keep failing", async () => {
    let fetchCount = 0;
    const retryDelays = [];

    const fakeFetch = async () => {
        fetchCount += 1;

        return {
            ok: false,
            status: 503,
            statusText: "Service Unavailable"
        };
    };

    const fakeDelay = async (milliseconds) => {
        retryDelays.push(milliseconds);
    };

    await assert.rejects(
        fetchFmiForecast(
            "Helsinki",
            fakeFetch,
            fakeDelay
        ),
        /FMI request failed with HTTP 503 Service Unavailable/
    );

    assert.equal(fetchCount, 3);

    assert.deepEqual(
        retryDelays,
        [
            500,
            1000
        ]
    );
});

test("retries temporary HTTP failure and then succeeds", async () => {
    const expectedXml = "<FeatureCollection />";
    let fetchCount = 0;
    const retryDelays = [];

    const fakeFetch = async () => {
        fetchCount += 1;

        if (fetchCount === 1) {
            return {
                ok: false,
                status: 503,
                statusText: "Service Unavailable"
            };
        }

        return {
            ok: true,
            status: 200,
            statusText: "OK",
            text: async () => expectedXml
        };
    };

    const fakeDelay = async (milliseconds) => {
        retryDelays.push(milliseconds);
    };

    const xml = await fetchFmiForecast(
        "Helsinki",
        fakeFetch,
        fakeDelay
    );

    assert.equal(xml, expectedXml);
    assert.equal(fetchCount, 2);

    assert.deepEqual(
        retryDelays,
        [
            500
        ]
    );
});

test("retries network failure and then succeeds", async () => {
    const expectedXml = "<FeatureCollection />";
    let fetchCount = 0;
    const retryDelays = [];

    const fakeFetch = async () => {
        fetchCount += 1;

        if (fetchCount === 1) {
            throw new Error("Temporary network failure");
        }

        return {
            ok: true,
            status: 200,
            statusText: "OK",
            text: async () => expectedXml
        };
    };

    const fakeDelay = async (milliseconds) => {
        retryDelays.push(milliseconds);
    };

    const xml = await fetchFmiForecast(
        "Helsinki",
        fakeFetch,
        fakeDelay
    );

    assert.equal(xml, expectedXml);
    assert.equal(fetchCount, 2);

    assert.deepEqual(
        retryDelays,
        [
            500
        ]
    );
});

test("does not retry permanent client errors", async () => {
    let fetchCount = 0;
    const retryDelays = [];

    const fakeFetch = async () => {
        fetchCount += 1;

        return {
            ok: false,
            status: 400,
            statusText: "Bad Request"
        };
    };

    const fakeDelay = async (milliseconds) => {
        retryDelays.push(milliseconds);
    };

    await assert.rejects(
        fetchFmiForecast(
            "Helsinki",
            fakeFetch,
            fakeDelay
        ),
        /FMI request failed with HTTP 400 Bad Request/
    );

    assert.equal(fetchCount, 1);
    assert.deepEqual(retryDelays, []);
});

test("builds FMI weather observation URL", () => {
    const url = buildFmiObservationUrl("Helsinki");

    assert.equal(url.origin, "https://opendata.fmi.fi");
    assert.equal(url.pathname, "/wfs");

    assert.equal(
        url.searchParams.get("storedquery_id"),
        "fmi::observations::weather::timevaluepair"
    );

    assert.equal(url.searchParams.get("place"), "Helsinki");
});

test("returns XML from successful FMI observation response", async () => {
    const expectedXml = "<FeatureCollection />";

    const fakeFetch = async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => expectedXml
    });

    const xml = await fetchFmiObservations("Helsinki", fakeFetch);

    assert.equal(xml, expectedXml);
});
