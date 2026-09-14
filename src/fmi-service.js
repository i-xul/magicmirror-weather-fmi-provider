/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/fmi-service.js
 * Created: 2026-09-13
 * Version: 0.2.0
 *
 * Purpose:
 * Provide a high-level weather interface for FMI data consumers such as
 * MagicMirror².
 *
 * Workflow:
 * 1. Fetch raw FMI XML.
 * 2. Parse FMI time-series parameters.
 * 3. Normalize the parameters into a common weather timeline.
 * 4. Share short-lived forecast data between consumers in the same process.
 * 5. Return either the latest observation or the forecast timeline.
 */

import {
    fetchFmiForecast,
    fetchFmiObservations
} from "./fmi-client.js";

import { parseFmiTimeValuePairXml } from "./fmi-parser.js";
import { buildWeatherTimeline } from "./fmi-weather.js";

const FORECAST_CACHE_TTL_MS = 30_000;

/*
 * Cache only the most recent forecast request for each place.
 *
 * The fetch implementation is stored with the cache entry so deterministic
 * tests using different injected fake fetch functions cannot accidentally
 * share cached data.
 *
 * Each entry can contain either:
 *
 * - an in-flight Promise while an FMI request is running
 * - a completed timeline with a short expiration time
 */
const forecastCache = new Map();

/**
 * Check whether an FMI observation contains all measured values required
 * for a MagicMirror² current weather object.
 *
 * Sunrise, sunset and weatherType are added later by the MagicMirror
 * transformation layer, so they are not required here.
 *
 * @param {object} observation Normalized FMI observation.
 * @returns {boolean} Whether all required measured values are available.
 */
function isCompleteCurrentObservation(observation) {
    const requiredFields = [
        "temperature",
        "humidity",
        "windDirection",
        "windSpeed"
    ];

    return requiredFields.every(
        (field) =>
            typeof observation?.[field] === "number" &&
            Number.isFinite(observation[field])
    );
}

/**
 * Fetch and normalize the latest complete FMI weather observation.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<object|null>} Latest normalized observation, or null.
 */
export async function getCurrentWeather(place, fetchImpl = fetch) {
    const xml = await fetchFmiObservations(place, fetchImpl);

    const parameters = parseFmiTimeValuePairXml(xml);
    const timeline = buildWeatherTimeline(parameters);

    for (let index = timeline.length - 1; index >= 0; index -= 1) {
        const observation = timeline[index];

        if (isCompleteCurrentObservation(observation)) {
            return observation;
        }
    }

    return null;
}

/**
 * Fetch and normalize an FMI HARMONIE forecast timeline without using cache.
 *
 * Keeping the actual request in a separate helper makes the cache lifecycle
 * easier to reason about and ensures failed requests can be removed cleanly.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<object[]>} Chronological normalized forecast timeline.
 */
async function fetchForecastTimeline(place, fetchImpl) {
    const xml = await fetchFmiForecast(place, fetchImpl);

    const parameters = parseFmiTimeValuePairXml(xml);

    return buildWeatherTimeline(parameters);
}

/**
 * Fetch and normalize the FMI HARMONIE forecast timeline.
 *
 * Forecast data is cached briefly so multiple MagicMirror² weather provider
 * instances for the same place can share one FMI request.
 *
 * The cache also stores an in-flight Promise. This means simultaneous current
 * and forecast updates are deduplicated instead of starting two identical FMI
 * forecast requests.
 *
 * Failed requests are never retained in the cache.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<object[]>} Chronological normalized forecast timeline.
 */
export async function getForecast(place, fetchImpl = fetch) {
    const cached = forecastCache.get(place);
    const now = Date.now();

    if (
        cached &&
        cached.fetchImpl === fetchImpl
    ) {
        if (cached.promise) {
            return cached.promise;
        }

        if (
            cached.timeline &&
            cached.expiresAt > now
        ) {
            return cached.timeline;
        }
    }

    const requestPromise = fetchForecastTimeline(
        place,
        fetchImpl
    );

    forecastCache.set(place, {
        fetchImpl,
        promise: requestPromise,
        timeline: null,
        expiresAt: 0
    });

    try {
        const timeline = await requestPromise;

        /*
         * Only replace the cache entry if it still belongs to this request.
         * This avoids an older request overwriting a newer entry if callers
         * use different injected fetch implementations for the same place.
         */
        const currentEntry = forecastCache.get(place);

        if (
            currentEntry &&
            currentEntry.promise === requestPromise
        ) {
            forecastCache.set(place, {
                fetchImpl,
                promise: null,
                timeline,
                expiresAt: Date.now() + FORECAST_CACHE_TTL_MS
            });
        }

        return timeline;
    } catch (error) {
        const currentEntry = forecastCache.get(place);

        if (
            currentEntry &&
            currentEntry.promise === requestPromise
        ) {
            forecastCache.delete(place);
        }

        throw error;
    }
}
