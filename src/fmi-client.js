/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/fmi-client.js
 * Created: 2026-09-13
 * Version: 0.2.0
 *
 * Purpose:
 * Fetch weather data from the Finnish Meteorological Institute (FMI)
 * open-data WFS service.
 *
 * Workflow:
 * 1. Validate the requested location.
 * 2. Build the appropriate FMI WFS stored-query URL.
 * 3. Fetch data from FMI with limited retries for temporary failures.
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

const MAX_REQUEST_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [
    500,
    1000
];

/**
 * Wait for a retry delay.
 *
 * Kept as an injectable dependency in request helpers so unit tests can
 * verify retry behaviour without actually sleeping.
 *
 * @param {number} milliseconds Delay duration.
 * @returns {Promise<void>}
 */
function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

/**
 * Determine whether an HTTP response represents a temporary failure that is
 * appropriate to retry.
 *
 * Retry:
 * - 408 Request Timeout
 * - 429 Too Many Requests
 * - all 5xx server errors
 *
 * Other 4xx responses normally indicate a permanent request problem and are
 * returned immediately without retrying.
 *
 * @param {number} status HTTP status code.
 * @returns {boolean} Whether the request should be retried.
 */
function isRetryableHttpStatus(status) {
    return (
        status === 408 ||
        status === 429 ||
        (
            status >= 500 &&
            status <= 599
        )
    );
}

/**
 * Fetch an FMI URL with limited retries for temporary failures.
 *
 * Network-level fetch failures and retryable HTTP responses are attempted up
 * to three times in total. Permanent HTTP errors fail immediately.
 *
 * @param {URL} url FMI request URL.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @param {Function} delayImpl Delay function used between retries.
 * @returns {Promise<object>} Successful Fetch Response-like object.
 */
async function fetchFmiResponse(
    url,
    fetchImpl,
    delayImpl
) {
    if (typeof fetchImpl !== "function") {
        throw new TypeError("fetchImpl must be a function");
    }

    if (typeof delayImpl !== "function") {
        throw new TypeError("delayImpl must be a function");
    }

    for (
        let attempt = 0;
        attempt < MAX_REQUEST_ATTEMPTS;
        attempt += 1
    ) {
        let response;

        try {
            response = await fetchImpl(url);
        } catch (error) {
            const isLastAttempt =
                attempt === MAX_REQUEST_ATTEMPTS - 1;

            if (isLastAttempt) {
                throw error;
            }

            await delayImpl(
                RETRY_DELAYS_MS[attempt]
            );

            continue;
        }

        if (response.ok) {
            return response;
        }

        const error = new Error(
            `FMI request failed with HTTP ${response.status} ${response.statusText}`
        );

        const isLastAttempt =
            attempt === MAX_REQUEST_ATTEMPTS - 1;

        if (
            isLastAttempt ||
            !isRetryableHttpStatus(response.status)
        ) {
            throw error;
        }

        await delayImpl(
            RETRY_DELAYS_MS[attempt]
        );
    }

    /*
     * The loop always either returns a successful response or throws.
     * This guard exists only as defensive protection against future changes.
     */
    throw new Error("FMI request failed unexpectedly");
}

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
 * A fetch implementation and retry delay implementation can be injected for
 * deterministic unit testing. Normal use relies on Node.js fetch and real
 * timer delays.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @param {Function} delayImpl Delay function used between retries.
 * @returns {Promise<string>} Raw FMI WFS XML response.
 */
export async function fetchFmiForecast(
    place,
    fetchImpl = fetch,
    delayImpl = delay
) {
    const url = buildFmiForecastUrl(place);

    const response = await fetchFmiResponse(
        url,
        fetchImpl,
        delayImpl
    );

    return response.text();
}

/**
 * Fetch raw FMI surface-weather observation XML.
 *
 * @param {string} place FMI place name.
 * @param {Function} fetchImpl Fetch-compatible function.
 * @param {Function} delayImpl Delay function used between retries.
 * @returns {Promise<string>} Raw FMI WFS XML response.
 */
export async function fetchFmiObservations(
    place,
    fetchImpl = fetch,
    delayImpl = delay
) {
    const url = buildFmiObservationUrl(place);

    const response = await fetchFmiResponse(
        url,
        fetchImpl,
        delayImpl
    );

    return response.text();
}
