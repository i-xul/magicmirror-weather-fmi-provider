/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/fmi-weather.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Transform parameter-based FMI weather time series into a chronological
 * weather timeline that is easier to consume by MagicMirror² and other
 * application code.
 *
 * Workflow:
 * 1. Receive parsed FMI parameter series from fmi-parser.js.
 * 2. Map supported FMI parameter names to internal weather field names.
 * 3. Merge values sharing the same timestamp into one weather object.
 * 4. Sort the resulting weather objects chronologically.
 */

/**
 * Mapping between FMI parameter names and the internal weather model.
 *
 * Keeping the mapping in one place makes it easier to add or rename FMI
 * parameters without changing the timeline-building logic.
 */
const PARAMETER_MAP = {
    // FMI HARMONIE forecast parameters.
    Temperature: "temperature",
    Humidity: "humidity",
    WindDirection: "windDirection",
    WindSpeedMS: "windSpeed",
    PrecipitationAmount: "precipitation",
    TotalCloudCover: "cloudCover",
    Visibility: "visibility",
    WindGust: "windGust",
    Pressure: "pressure",
    DewPoint: "dewPoint",

    // FMI surface-weather observation parameters.
    t2m: "temperature",
    rh: "humidity",
    wd_10min: "windDirection",
    ws_10min: "windSpeed",
    wg_10min: "windGust",
    r_1h: "precipitation",
    vis: "visibility",
    p_sea: "pressure",
    td: "dewPoint"
};

/**
 * Build a chronological weather timeline from parsed FMI parameter series.
 *
 * Input example:
 *
 * Map {
 *   "Temperature" => [
 *     { time: "2026-09-13T13:00:00Z", value: 15.5 }
 *   ],
 *   "Humidity" => [
 *     { time: "2026-09-13T13:00:00Z", value: 78 }
 *   ]
 * }
 *
 * Output example:
 *
 * [
 *   {
 *     time: "2026-09-13T13:00:00Z",
 *     temperature: 15.5,
 *     humidity: 78
 *   }
 * ]
 *
 * @param {Map<string, Array<{time: string, value: number|null}>>} parameters
 *   Parsed FMI parameter series.
 * @returns {Array<object>} Chronologically sorted weather timeline.
 */
export function buildWeatherTimeline(parameters) {
    if (!(parameters instanceof Map)) {
        throw new TypeError("FMI parameters must be provided as a Map");
    }

    const timelineByTime = new Map();

    for (const [sourceParameter, targetField] of Object.entries(PARAMETER_MAP)) {
        const values = parameters.get(sourceParameter);

        if (!Array.isArray(values)) {
            continue;
        }

        for (const entry of values) {
            if (!entry?.time) {
                continue;
            }

            if (!timelineByTime.has(entry.time)) {
                timelineByTime.set(entry.time, {
                    time: entry.time
                });
            }

            timelineByTime.get(entry.time)[targetField] = entry.value;
        }
    }

    return [...timelineByTime.values()].sort(
        (a, b) => new Date(a.time) - new Date(b.time)
    );
}
