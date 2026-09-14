/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/magicmirror-service.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify the high-level MagicMirror² weather service using deterministic
 * normalized data and synthetic FMI XML responses.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    buildMagicMirrorWeatherData,
    getMagicMirrorWeather
} from "../src/magicmirror-service.js";

/**
 * Build one minimal FMI MeasurementTimeseries member for service tests.
 *
 * @param {string} parameter FMI parameter name.
 * @param {Array<[string, number]>} values Timestamp/value pairs.
 * @returns {string} FMI XML member.
 */
function buildSeriesMember(parameter, values) {
    const points = values
        .map(
            ([time, value]) => `
                <wml2:point>
                    <wml2:MeasurementTVP>
                        <wml2:time>${time}</wml2:time>
                        <wml2:value>${value}</wml2:value>
                    </wml2:MeasurementTVP>
                </wml2:point>
            `
        )
        .join("");

    return `
        <wfs:member>
            <omso:PointTimeSeriesObservation>
                <om:observedProperty
                    xlink:href="https://opendata.fmi.fi/meta?param=${parameter}" />
                <om:result>
                    <wml2:MeasurementTimeseries>
                        ${points}
                    </wml2:MeasurementTimeseries>
                </om:result>
            </omso:PointTimeSeriesObservation>
        </wfs:member>
    `;
}

/**
 * Wrap FMI timeseries members in the minimal namespaces required by parser
 * tests.
 *
 * @param {string[]} members FMI XML members.
 * @returns {string} Complete synthetic FMI response.
 */
function buildFeatureCollection(members) {
    return `
        <wfs:FeatureCollection
            xmlns:wfs="http://www.opengis.net/wfs/2.0"
            xmlns:omso="http://inspire.ec.europa.eu/schemas/omso/3.0"
            xmlns:om="http://www.opengis.net/om/2.0"
            xmlns:wml2="http://www.opengis.net/waterml/2.0"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            ${members.join("")}
        </wfs:FeatureCollection>
    `;
}

const normalizedObservation = {
    time: "2026-09-13T13:30:00Z",
    temperature: 15.6,
    humidity: 89,
    windDirection: 245,
    windSpeed: 2.9
};

const normalizedForecast = [
    {
        time: "2026-09-13T13:00:00Z",
        temperature: 16,
        precipitation: 0.25,
        weatherSymbol: 2
    },
    {
        time: "2026-09-13T14:00:00Z",
        temperature: 15,
        precipitation: 0.5,
        weatherSymbol: 2
    }
];

test("builds combined MagicMirror weather data", () => {
    const weather = buildMagicMirrorWeatherData(
        normalizedObservation,
        normalizedForecast,
        60.1699,
        24.9384,
        "Europe/Helsinki"
    );

    assert.ok(weather.current);
    assert.equal(
        weather.current.temperature,
        15.6
    );
    assert.equal(
        weather.current.humidity,
        89
    );
    assert.equal(
        weather.current.weatherType,
        "day-cloudy"
    );

    assert.equal(weather.forecast.length, 1);

    assert.deepEqual(
        weather.forecast[0],
        {
            date: new Date(
                "2026-09-13T13:00:00Z"
            ),
            maxTemperature: 16,
            minTemperature: 15,
            precipitationAmount: 0.75,
            weatherType: "day-cloudy"
        }
    );
});

test("supports missing current observation", () => {
    const weather = buildMagicMirrorWeatherData(
        null,
        normalizedForecast,
        60.1699,
        24.9384,
        "Europe/Helsinki"
    );

    assert.equal(weather.current, null);
    assert.equal(weather.forecast.length, 1);
});

test("fetches FMI data and builds MagicMirror weather data", async () => {
    const observationXml = buildFeatureCollection([
        buildSeriesMember(
            "t2m",
            [
                [
                    "2026-09-13T13:30:00Z",
                    15.6
                ]
            ]
        ),
        buildSeriesMember(
            "rh",
            [
                [
                    "2026-09-13T13:30:00Z",
                    89
                ]
            ]
        ),
        buildSeriesMember(
            "wd_10min",
            [
                [
                    "2026-09-13T13:30:00Z",
                    245
                ]
            ]
        ),
        buildSeriesMember(
            "ws_10min",
            [
                [
                    "2026-09-13T13:30:00Z",
                    2.9
                ]
            ]
        )
    ]);

    const forecastXml = buildFeatureCollection([
        buildSeriesMember(
            "Temperature",
            [
                [
                    "2026-09-13T13:00:00Z",
                    16
                ],
                [
                    "2026-09-13T14:00:00Z",
                    15
                ]
            ]
        ),
        buildSeriesMember(
            "Precipitation1h",
            [
                [
                    "2026-09-13T13:00:00Z",
                    0.25
                ],
                [
                    "2026-09-13T14:00:00Z",
                    0.5
                ]
            ]
        ),
        buildSeriesMember(
            "WeatherSymbol3",
            [
                [
                    "2026-09-13T13:00:00Z",
                    2
                ],
                [
                    "2026-09-13T14:00:00Z",
                    2
                ]
            ]
        )
    ]);

    const requestedUrls = [];

    const fakeFetch = async (url) => {
        const urlString = String(url);
        const parsedUrl = new URL(urlString);

        requestedUrls.push(urlString);

        const storedQueryId =
            parsedUrl.searchParams.get("storedquery_id");

        if (
            storedQueryId ===
            "fmi::observations::weather::timevaluepair"
        ) {
            return {
                ok: true,
                status: 200,
                statusText: "OK",
                text: async () => observationXml
            };
        }

        if (
            storedQueryId ===
            "fmi::forecast::harmonie::surface::point::timevaluepair"
        ) {
            return {
                ok: true,
                status: 200,
                statusText: "OK",
                text: async () => forecastXml
            };
        }

        throw new Error(
            `Unexpected FMI URL: ${urlString}`
        );
    };

    const weather = await getMagicMirrorWeather(
        {
            place: "Helsinki",
            latitude: 60.1699,
            longitude: 24.9384,
            timeZone: "Europe/Helsinki"
        },
        fakeFetch
    );

    assert.equal(requestedUrls.length, 2);

    assert.ok(weather.current);
    assert.equal(
        weather.current.temperature,
        15.6
    );
    assert.equal(
        weather.current.weatherType,
        "day-cloudy"
    );

    assert.equal(weather.forecast.length, 1);
    assert.equal(
        weather.forecast[0].precipitationAmount,
        0.75
    );
});

test("shares forecast request between current and forecast types", async () => {
    const observationXml = buildFeatureCollection([
        buildSeriesMember(
            "t2m",
            [
                [
                    "2026-09-13T13:30:00Z",
                    15.6
                ]
            ]
        ),
        buildSeriesMember(
            "rh",
            [
                [
                    "2026-09-13T13:30:00Z",
                    89
                ]
            ]
        ),
        buildSeriesMember(
            "wd_10min",
            [
                [
                    "2026-09-13T13:30:00Z",
                    245
                ]
            ]
        ),
        buildSeriesMember(
            "ws_10min",
            [
                [
                    "2026-09-13T13:30:00Z",
                    2.9
                ]
            ]
        )
    ]);

    const forecastXml = buildFeatureCollection([
        buildSeriesMember(
            "Temperature",
            [
                [
                    "2026-09-13T13:00:00Z",
                    16
                ],
                [
                    "2026-09-13T14:00:00Z",
                    15
                ]
            ]
        ),
        buildSeriesMember(
            "Precipitation1h",
            [
                [
                    "2026-09-13T13:00:00Z",
                    0.25
                ],
                [
                    "2026-09-13T14:00:00Z",
                    0.5
                ]
            ]
        ),
        buildSeriesMember(
            "WeatherSymbol3",
            [
                [
                    "2026-09-13T13:00:00Z",
                    2
                ],
                [
                    "2026-09-13T14:00:00Z",
                    2
                ]
            ]
        )
    ]);

    let observationRequestCount = 0;
    let forecastRequestCount = 0;

    const fakeFetch = async (url) => {
        const parsedUrl = new URL(String(url));
        const storedQueryId =
            parsedUrl.searchParams.get("storedquery_id");

        if (
            storedQueryId ===
            "fmi::observations::weather::timevaluepair"
        ) {
            observationRequestCount += 1;

            return {
                ok: true,
                status: 200,
                statusText: "OK",
                text: async () => observationXml
            };
        }

        if (
            storedQueryId ===
            "fmi::forecast::harmonie::surface::point::timevaluepair"
        ) {
            forecastRequestCount += 1;

            /*
             * Keep the forecast request in flight briefly so both service
             * calls overlap and exercise promise deduplication.
             */
            await new Promise((resolve) => {
                setTimeout(resolve, 10);
            });

            return {
                ok: true,
                status: 200,
                statusText: "OK",
                text: async () => forecastXml
            };
        }

        throw new Error(
            `Unexpected FMI URL: ${String(url)}`
        );
    };

    const commonConfig = {
        place: "Helsinki",
        latitude: 60.1699,
        longitude: 24.9384,
        timeZone: "Europe/Helsinki"
    };

    const [
        currentWeather,
        forecastWeather
    ] = await Promise.all([
        getMagicMirrorWeather(
            {
                ...commonConfig,
                type: "current"
            },
            fakeFetch
        ),
        getMagicMirrorWeather(
            {
                ...commonConfig,
                type: "forecast"
            },
            fakeFetch
        )
    ]);

    assert.equal(observationRequestCount, 1);
    assert.equal(forecastRequestCount, 1);

    assert.ok(currentWeather.current);
    assert.equal(
        currentWeather.current.temperature,
        15.6
    );

    assert.equal(forecastWeather.current, null);

    assert.equal(
        currentWeather.forecast.length,
        1
    );
    assert.equal(
        forecastWeather.forecast.length,
        1
    );
});

test("fetches only forecast data for forecast type", async () => {
    const forecastXml = buildFeatureCollection([
        buildSeriesMember(
            "Temperature",
            [
                [
                    "2026-09-13T13:00:00Z",
                    16
                ],
                [
                    "2026-09-13T14:00:00Z",
                    15
                ]
            ]
        ),
        buildSeriesMember(
            "Precipitation1h",
            [
                [
                    "2026-09-13T13:00:00Z",
                    0.25
                ],
                [
                    "2026-09-13T14:00:00Z",
                    0.5
                ]
            ]
        ),
        buildSeriesMember(
            "WeatherSymbol3",
            [
                [
                    "2026-09-13T13:00:00Z",
                    2
                ],
                [
                    "2026-09-13T14:00:00Z",
                    2
                ]
            ]
        )
    ]);

    const requestedUrls = [];

    const fakeFetch = async (url) => {
        const urlString = String(url);
        const parsedUrl = new URL(urlString);

        requestedUrls.push(urlString);

        const storedQueryId =
            parsedUrl.searchParams.get("storedquery_id");

        assert.equal(
            storedQueryId,
            "fmi::forecast::harmonie::surface::point::timevaluepair"
        );

        return {
            ok: true,
            status: 200,
            statusText: "OK",
            text: async () => forecastXml
        };
    };

    const weather = await getMagicMirrorWeather(
        {
            place: "Helsinki",
            latitude: 60.1699,
            longitude: 24.9384,
            timeZone: "Europe/Helsinki",
            type: "forecast"
        },
        fakeFetch
    );

    assert.equal(requestedUrls.length, 1);
    assert.equal(weather.current, null);
    assert.equal(weather.forecast.length, 1);
    assert.equal(
        weather.forecast[0].precipitationAmount,
        0.75
    );
});

test("fetches only forecast data for daily type", async () => {
    const forecastXml = buildFeatureCollection([
        buildSeriesMember(
            "Temperature",
            [
                [
                    "2026-09-13T13:00:00Z",
                    16
                ],
                [
                    "2026-09-13T14:00:00Z",
                    15
                ]
            ]
        ),
        buildSeriesMember(
            "Precipitation1h",
            [
                [
                    "2026-09-13T13:00:00Z",
                    0.25
                ],
                [
                    "2026-09-13T14:00:00Z",
                    0.5
                ]
            ]
        ),
        buildSeriesMember(
            "WeatherSymbol3",
            [
                [
                    "2026-09-13T13:00:00Z",
                    2
                ],
                [
                    "2026-09-13T14:00:00Z",
                    2
                ]
            ]
        )
    ]);

    const requestedUrls = [];

    const fakeFetch = async (url) => {
        const urlString = String(url);
        const parsedUrl = new URL(urlString);

        requestedUrls.push(urlString);

        const storedQueryId =
            parsedUrl.searchParams.get("storedquery_id");

        assert.equal(
            storedQueryId,
            "fmi::forecast::harmonie::surface::point::timevaluepair"
        );

        return {
            ok: true,
            status: 200,
            statusText: "OK",
            text: async () => forecastXml
        };
    };

    const weather = await getMagicMirrorWeather(
        {
            place: "Helsinki",
            latitude: 60.1699,
            longitude: 24.9384,
            timeZone: "Europe/Helsinki",
            type: "daily"
        },
        fakeFetch
    );

    assert.equal(requestedUrls.length, 1);
    assert.equal(weather.current, null);
    assert.equal(weather.forecast.length, 1);
});

test("rejects invalid service configuration", async () => {
    await assert.rejects(
        () =>
            getMagicMirrorWeather(
                null,
                async () => {
                    throw new Error(
                        "Fetch should not be called"
                    );
                }
            ),
        {
            name: "TypeError",
            message:
                "MagicMirror weather configuration must be an object"
        }
    );
});