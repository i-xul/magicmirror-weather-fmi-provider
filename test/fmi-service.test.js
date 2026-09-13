/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/fmi-service.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify the high-level FMI weather service using deterministic local
 * XML fixtures instead of live network requests.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
    getCurrentWeather,
    getForecast
} from "../src/fmi-service.js";

const forecastFixture = await readFile(
    new URL("./fixtures/fmi-helsinki-forecast.xml", import.meta.url),
    "utf8"
);

const observationFixture = await readFile(
    new URL("./fixtures/fmi-helsinki-observations.xml", import.meta.url),
    "utf8"
);

test("returns latest normalized FMI weather observation", async () => {
    const fakeFetch = async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => observationFixture
    });

    const current = await getCurrentWeather("Helsinki", fakeFetch);

    assert.ok(current);
    assert.equal(typeof current.time, "string");
    assert.equal(typeof current.temperature, "number");
});

test("returns normalized FMI forecast timeline", async () => {
    const fakeFetch = async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => forecastFixture
    });

    const forecast = await getForecast("Helsinki", fakeFetch);

    assert.ok(Array.isArray(forecast));
    assert.ok(forecast.length > 0);

    assert.equal(typeof forecast[0].time, "string");
    assert.equal(typeof forecast[0].temperature, "number");
});

test("skips newer incomplete observations without temperature", async () => {
    const xml = `
        <wfs:FeatureCollection
            xmlns:wfs="http://www.opengis.net/wfs/2.0"
            xmlns:omso="http://inspire.ec.europa.eu/schemas/omso/3.0"
            xmlns:om="http://www.opengis.net/om/2.0"
            xmlns:wml2="http://www.opengis.net/waterml/2.0"
            xmlns:xlink="http://www.w3.org/1999/xlink">

            <wfs:member>
                <omso:PointTimeSeriesObservation>
                    <om:observedProperty
                        xlink:href="https://opendata.fmi.fi/meta?param=t2m" />
                    <om:result>
                        <wml2:MeasurementTimeseries>
                            <wml2:point>
                                <wml2:MeasurementTVP>
                                    <wml2:time>2026-09-13T13:30:00Z</wml2:time>
                                    <wml2:value>15.6</wml2:value>
                                </wml2:MeasurementTVP>
                            </wml2:point>
                        </wml2:MeasurementTimeseries>
                    </om:result>
                </omso:PointTimeSeriesObservation>
            </wfs:member>

            <wfs:member>
                <omso:PointTimeSeriesObservation>
                    <om:observedProperty
                        xlink:href="https://opendata.fmi.fi/meta?param=vis" />
                    <om:result>
                        <wml2:MeasurementTimeseries>
                            <wml2:point>
                                <wml2:MeasurementTVP>
                                    <wml2:time>2026-09-13T13:40:00Z</wml2:time>
                                    <wml2:value>30000</wml2:value>
                                </wml2:MeasurementTVP>
                            </wml2:point>
                        </wml2:MeasurementTimeseries>
                    </om:result>
                </omso:PointTimeSeriesObservation>
            </wfs:member>
        </wfs:FeatureCollection>
    `;

    const fakeFetch = async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => xml
    });

    const current = await getCurrentWeather("Helsinki", fakeFetch);

    assert.ok(current);
    assert.equal(current.time, "2026-09-13T13:30:00Z");
    assert.equal(current.temperature, 15.6);
});
