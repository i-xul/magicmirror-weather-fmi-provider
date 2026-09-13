/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/fmi-client.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Fetch HARMONIE point forecast data from the Finnish Meteorological
 * Institute (FMI) open-data WFS service.
 *
 * Workflow:
 * 1. Validate the requested location.
 * 2. Build an FMI WFS stored-query URL.
 * 3. Fetch the forecast from FMI.
 * 4. Validate the HTTP response.
 * 5. Return the raw XML document for parsing by fmi-parser.js.
 */

const FMI_WFS_URL = "https://opendata.fmi.fi/wfs";

const HARMONIE_POINT_FORECAST_QUERY =
    "fmi::forecast::harmonie::surface::point::timevaluepair";

const HARMONIE_FORECAST_PARAMETERS = [
    "Temperature",
    "Humidity",
    "WindDirection",
    "WindSpeedMS",
    "Precipitation1h",
    "TotalCloudCover",
    "Visibility",
    "WindGust",
    "Pressure",
    "DewPoint",
    "WeatherSymbol3"
].join(",");

const WEATHER_OBSERVATION_QUERY =
    "fmi::observations::weather::timevaluepair";

/**
 * Build an FMI HARMONIE point-forecast URL.
 *
 * URLSearchParams handles escaping location names safely, including spaces
 * and non-ASCII characters.
 *
 * @param {string} place FMI place name, for example "Helsinki".
 * @returns {URL} Complete FMI WFS request URL.
 */
export function buildFmiForecastUrl(place) {
    if (typeof place !== "string" || place.trim() === "") {
        throw new TypeError("FMI place must be a non-empty string");
    }

    const url = new URL(FMI_WFS_URL);

    url.search = new URLSearchParams({
        service: "WFS",
        version: "2.0.0",
        request: "getFeature",
        storedquery_id: HARMONIE_POINT_FORECAST_QUERY,
        place: place.trim(),
        parameters: HARMONIE_FORECAST_PARAMETERS
    }).toString();

    return url;
}

/**
 * Build an FMI surface-weather observation URL.
 *
 * FMI resolves the place name to the nearest suitable observation station.
 *
 * @param {string} place FMI place name, for example "Helsinki".
 * @returns {URL} Complete FMI WFS request URL.
 */
export function buildFmiObservationUrl(place) {
    if (typeof place !== "string" || place.trim() === "") {
        throw new TypeError("FMI place must be a non-empty string");
    }

    const url = new URL(FMI_WFS_URL);

    url.search = new URLSearchParams({
        service: "WFS",
        version: "2.0.0",
        request: "getFeature",
        storedquery_id: WEATHER_OBSERVATION_QUERY,
        place: place.trim()
    }).toString();

    return url;
}

/**
 * Fetch raw FMI HARMONIE point-forecast XML.
 *
 * A fetch implementation can be injected for deterministic unit testing.
 * In normal use, the built-in Node.js fetch implementation is used.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<string>} Raw FMI WFS XML response.
 * @throws {Error} If FMI returns a non-successful HTTP response.
 */
export async function fetchFmiForecast(place, fetchImpl = fetch) {
    if (typeof fetchImpl !== "function") {
        throw new TypeError("fetchImpl must be a function");
    }

    const url = buildFmiForecastUrl(place);
    const response = await fetchImpl(url);

    if (!response.ok) {
        throw new Error(
            `FMI request failed with HTTP ${response.status} ${response.statusText}`
        );
    }

    return response.text();
}

/**
 * Fetch raw FMI surface-weather observation XML.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @returns {Promise<string>} Raw FMI WFS XML response.
 * @throws {Error} If FMI returns a non-successful HTTP response.
 */
export async function fetchFmiObservations(place, fetchImpl = fetch) {
    if (typeof fetchImpl !== "function") {
        throw new TypeError("fetchImpl must be a function");
    }

    const url = buildFmiObservationUrl(place);
    const response = await fetchImpl(url);

    if (!response.ok) {
        throw new Error(
            `FMI request failed with HTTP ${response.status} ${response.statusText}`
        );
    }

    return response.text();
}
