/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/fmi-parser.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Parse Finnish Meteorological Institute (FMI) WFS timevaluepair XML
 * into a simpler JavaScript structure suitable for MagicMirror².
 *
 * Workflow:
 * 1. Parse FMI XML with fast-xml-parser.
 * 2. Locate each OM_Observation entry.
 * 3. Read the FMI parameter name from observedProperty.
 * 4. Extract MeasurementTVP time/value pairs.
 * 5. Return parameter-based time series for later transformation into
 *    MagicMirror weather objects.
 */

import { XMLParser } from "fast-xml-parser";

/**
 * Convert a value into an array.
 *
 * FMI XML elements may be represented either as a single object or as an
 * array depending on the number of returned elements.
 *
 * @param {*} value Value to normalize.
 * @returns {Array} Normalized array.
 */
function asArray(value) {
    if (value === undefined || value === null) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
}

/**
 * Find an href-like attribute regardless of namespace handling.
 *
 * Depending on XML parser settings, an attribute may appear as "@_href"
 * or retain part of its original namespace.
 *
 * @param {object} object Parsed XML object.
 * @returns {string|null} Attribute value or null.
 */
function getHrefAttribute(object) {
    if (!object || typeof object !== "object") {
        return null;
    }

    const key = Object.keys(object).find((name) =>
        name.toLowerCase().endsWith("href")
    );

    return key ? object[key] : null;
}

/**
 * Extract an FMI parameter name from an observedProperty URL.
 *
 * @param {string} href FMI metadata URL.
 * @returns {string|null} Parameter name.
 */
function getParameterName(href) {
    if (!href) {
        return null;
    }

    try {
        const url = new URL(href);
        return url.searchParams.get("param");
    } catch {
        const match = href.match(/[?&]param=([^&]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }
}

/**
 * Parse FMI WFS timevaluepair XML.
 *
 * @param {string} xml FMI XML document.
 * @returns {Map<string, Array<{time: string, value: number|null}>>}
 *   Map keyed by FMI parameter name.
 */
export function parseFmiTimeValuePairXml(xml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        removeNSPrefix: true,
        parseTagValue: false,
        trimValues: true
    });

    const document = parser.parse(xml);
    const members = asArray(document?.FeatureCollection?.member);

    const parameters = new Map();

    for (const member of members) {
        const observation = member?.PointTimeSeriesObservation;

        if (!observation) {
            continue;
        }

        const href = getHrefAttribute(observation.observedProperty);
        const parameterName = getParameterName(href);

        if (!parameterName) {
            continue;
        }

        const points = asArray(
            observation?.result?.MeasurementTimeseries?.point
        );

        const values = [];

        for (const point of points) {
            const measurement = point?.MeasurementTVP;

            if (!measurement?.time) {
                continue;
            }

            const rawValue = measurement.value;
            const numericValue = Number(rawValue);

            values.push({
                time: measurement.time,
                value: Number.isFinite(numericValue) ? numericValue : null
            });
        }

        parameters.set(parameterName, values);
    }

    return parameters;
}
