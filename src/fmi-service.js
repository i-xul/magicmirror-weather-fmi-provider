/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/fmi-service.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Provide a high-level weather interface for FMI data consumers such as
 * MagicMirror².
 *
 * Workflow:
 * 1. Fetch raw FMI XML.
 * 2. Parse FMI time-series parameters.
 * 3. Normalize the parameters into a common weather timeline.
 * 4. Return either the latest observation or the forecast timeline.
 */

import {
    fetchFmiForecast,
    fetchFmiObservations
} from "./fmi-client.js";

import { parseFmiTimeValuePairXml } from "./fmi-parser.js";
import { buildWeatherTimeline } from "./fmi-weather.js";

/**
 * Fetch and normalize the latest FMI weather observation.
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

        if (typeof observation.temperature === "number") {
            return observation;
        }
    }

    return null;
}

/**
 * Fetch and normalize the FMI HARMONIE forecast timeline.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<object[]>} Chronological normalized forecast timeline.
 */
export async function getForecast(place, fetchImpl = fetch) {
    const xml = await fetchFmiForecast(place, fetchImpl);

    const parameters = parseFmiTimeValuePairXml(xml);

    return buildWeatherTimeline(parameters);
}
