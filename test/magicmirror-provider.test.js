/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/magicmirror-provider.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify the MagicMirror² FMI provider lifecycle without network access
 * or real timers.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    MagicMirrorFmiProvider
} from "../src/magicmirror-provider.js";

const baseConfig = {
    location: "Helsinki",
    lat: 60.1699,
    lon: 24.9384,
    timezone: "Europe/Helsinki",
    type: "current",
    updateInterval: 600000
};

const currentWeather = {
    temperature: 15.6,
    humidity: 89,
    windFromDirection: 245,
    windSpeed: 2.9,
    sunrise: new Date(
        "2026-09-13T03:40:00Z"
    ),
    sunset: new Date(
        "2026-09-13T16:45:00Z"
    ),
    weatherType: "day-cloudy"
};

const forecastWeather = [
    {
        date: new Date(
            "2026-09-14T09:00:00Z"
        ),
        maxTemperature: 17,
        minTemperature: 10,
        precipitationAmount: 0.5,
        weatherType: "day-cloudy"
    },
    {
        date: new Date(
            "2026-09-15T09:00:00Z"
        ),
        maxTemperature: 16,
        minTemperature: 9,
        precipitationAmount: 1.2,
        weatherType: "day-rain"
    },
    {
        date: new Date(
            "2026-09-16T09:00:00Z"
        ),
        maxTemperature: 14,
        minTemperature: 8,
        precipitationAmount: 0,
        weatherType: "day-sunny"
    }
];

/**
 * Create a timer implementation that records scheduled callbacks without
 * actually waiting.
 *
 * @returns {object} Fake timer implementation and recorded state.
 */
function createFakeTimer() {
    const state = {
        callbacks: [],
        delays: [],
        cleared: []
    };

    return {
        state,

        api: {
            setTimeout(callback, delay) {
                state.callbacks.push(callback);
                state.delays.push(delay);

                return state.callbacks.length;
            },

            clearTimeout(timerId) {
                state.cleared.push(timerId);
            }
        }
    };
}

test("delivers current weather through MagicMirror callback", async () => {
    const fakeTimer = createFakeTimer();

    const serviceCalls = [];

    const provider =
        new MagicMirrorFmiProvider(
            {
                ...baseConfig
            },
            async (config) => {
                serviceCalls.push(config);

                return {
                    current: currentWeather,
                    forecast: forecastWeather
                };
            },
            fakeTimer.api
        );

    let receivedData = null;

    provider.setCallbacks(
        (data) => {
            receivedData = data;
        },
        () => {
            assert.fail(
                "Error callback should not be called"
            );
        }
    );

    provider.initialize();

    provider.stopped = false;
    await provider.updateWeather();

    assert.deepEqual(
        serviceCalls,
        [
            {
                place: "Helsinki",
                latitude: 60.1699,
                longitude: 24.9384,
                timeZone: "Europe/Helsinki"
            }
        ]
    );

    assert.deepEqual(
        receivedData,
        currentWeather
    );

    assert.deepEqual(
        fakeTimer.state.delays,
        [600000]
    );
});

test("delivers limited forecast data", async () => {
    const fakeTimer = createFakeTimer();

    const provider =
        new MagicMirrorFmiProvider(
            {
                ...baseConfig,
                type: "forecast",
                maxNumberOfDays: 2
            },
            async () => ({
                current: currentWeather,
                forecast: forecastWeather
            }),
            fakeTimer.api
        );

    let receivedData = null;

    provider.setCallbacks(
        (data) => {
            receivedData = data;
        },
        () => {
            assert.fail(
                "Error callback should not be called"
            );
        }
    );

    provider.initialize();

    provider.stopped = false;
    await provider.updateWeather();

    assert.deepEqual(
        receivedData,
        forecastWeather.slice(0, 2)
    );
});

test("accepts daily as forecast type", async () => {
    const fakeTimer = createFakeTimer();

    const provider =
        new MagicMirrorFmiProvider(
            {
                ...baseConfig,
                type: "daily"
            },
            async () => ({
                current: currentWeather,
                forecast: forecastWeather
            }),
            fakeTimer.api
        );

    let receivedData = null;

    provider.setCallbacks(
        (data) => {
            receivedData = data;
        },
        () => {
            assert.fail(
                "Error callback should not be called"
            );
        }
    );

    provider.initialize();

    provider.stopped = false;
    await provider.updateWeather();

    assert.deepEqual(
        receivedData,
        forecastWeather
    );
});

test("reports invalid provider configuration", () => {
    const provider =
        new MagicMirrorFmiProvider({
            ...baseConfig,
            timezone: ""
        });

    let receivedError = null;

    provider.setCallbacks(
        () => {
            assert.fail(
                "Data callback should not be called"
            );
        },
        (error) => {
            receivedError = error;
        }
    );

    provider.initialize();

    assert.equal(
        provider.initialized,
        false
    );

    assert.deepEqual(
        receivedError,
        {
            message:
                "FMI weather provider requires config.timezone",
            translationKey:
                "MODULE_ERROR_UNSPECIFIED"
        }
    );
});

test("rejects unsupported hourly weather type", () => {
    const provider =
        new MagicMirrorFmiProvider({
            ...baseConfig,
            type: "hourly"
        });

    let receivedError = null;

    provider.setCallbacks(
        () => {},
        (error) => {
            receivedError = error;
        }
    );

    provider.initialize();

    assert.equal(
        provider.initialized,
        false
    );

    assert.equal(
        receivedError.message,
        "FMI weather provider supports only current, " +
        "forecast and daily types"
    );
});

test("reports weather service errors", async () => {
    const fakeTimer = createFakeTimer();

    const provider =
        new MagicMirrorFmiProvider(
            {
                ...baseConfig
            },
            async () => {
                throw new Error(
                    "FMI test failure"
                );
            },
            fakeTimer.api
        );

    let receivedError = null;

    provider.setCallbacks(
        () => {
            assert.fail(
                "Data callback should not be called"
            );
        },
        (error) => {
            receivedError = error;
        }
    );

    provider.initialize();

    provider.stopped = false;
    await provider.updateWeather();

    assert.deepEqual(
        receivedError,
        {
            message: "FMI test failure",
            translationKey:
                "MODULE_ERROR_UNSPECIFIED"
        }
    );

    assert.deepEqual(
        fakeTimer.state.delays,
        [600000]
    );
});

test("stop clears the active update timer", () => {
    const fakeTimer = createFakeTimer();

    const provider =
        new MagicMirrorFmiProvider(
            {
                ...baseConfig,
                initialLoadDelay: 2500
            },
            async () => ({
                current: currentWeather,
                forecast: forecastWeather
            }),
            fakeTimer.api
        );

    provider.setCallbacks(
        () => {},
        () => {}
    );

    provider.initialize();
    provider.start();

    assert.deepEqual(
        fakeTimer.state.delays,
        [2500]
    );

    provider.stop();

    assert.deepEqual(
        fakeTimer.state.cleared,
        [1]
    );

    assert.equal(
        provider.stopped,
        true
    );
});