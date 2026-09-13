/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/magicmirror-provider.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Implement the MagicMirror² server-side weather provider lifecycle for FMI.
 *
 * Workflow:
 * 1. Receive the full MagicMirror weather module configuration.
 * 2. Validate FMI-specific provider configuration.
 * 3. Fetch and transform FMI weather data through the service layer.
 * 4. Return current or forecast data through MagicMirror callbacks.
 * 5. Schedule periodic updates until the provider is stopped.
 */

import {
    getMagicMirrorWeather
} from "./magicmirror-service.js";

const DEFAULT_UPDATE_INTERVAL = 600000;
const DEFAULT_MAX_FORECAST_DAYS = 5;

/**
 * Validate provider configuration required by the FMI implementation.
 *
 * @param {object} config MagicMirror weather module configuration.
 * @returns {string|null} Validation error message, or null.
 */
function validateConfig(config) {
    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        return "FMI weather configuration must be an object";
    }

    if (
        typeof config.location !== "string" ||
        config.location.trim() === ""
    ) {
        return "FMI weather provider requires config.location";
    }

    if (
        typeof config.lat !== "number" ||
        !Number.isFinite(config.lat) ||
        config.lat < -90 ||
        config.lat > 90
    ) {
        return "FMI weather provider requires a valid config.lat";
    }

    if (
        typeof config.lon !== "number" ||
        !Number.isFinite(config.lon) ||
        config.lon < -180 ||
        config.lon > 180
    ) {
        return "FMI weather provider requires a valid config.lon";
    }

    if (
        typeof config.timezone !== "string" ||
        config.timezone.trim() === ""
    ) {
        return "FMI weather provider requires config.timezone";
    }

    try {
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: config.timezone.trim()
            }
        );
    } catch {
        return "FMI weather provider requires a valid IANA timezone";
    }

    if (
        ![
            "current",
            "forecast",
            "daily"
        ].includes(config.type)
    ) {
        return (
            "FMI weather provider supports only current, " +
            "forecast and daily types"
        );
    }

    return null;
}

/**
 * MagicMirror² FMI weather provider.
 */
export class MagicMirrorFmiProvider {
    /**
     * Create the provider.
     *
     * Optional dependencies are injectable so lifecycle behaviour can be
     * tested without real network requests or real timers.
     *
     * @param {object} config MagicMirror weather module configuration.
     * @param {Function} weatherService FMI MagicMirror weather service.
     * @param {object} timerApi Timer implementation.
     */
    constructor(
        config,
        weatherService = getMagicMirrorWeather,
        timerApi = {
            setTimeout,
            clearTimeout
        }
    ) {
        this.config = config;
        this.weatherService = weatherService;
        this.timerApi = timerApi;

        this.locationName =
            typeof config?.location === "string"
                ? config.location
                : null;

        this.onDataCallback = null;
        this.onErrorCallback = null;

        this.timer = null;
        this.initialized = false;
        this.stopped = true;
        this.updateInProgress = false;
    }

    /**
     * Store callbacks supplied by the MagicMirror weather node helper.
     *
     * @param {Function} onData Weather data callback.
     * @param {Function} onError Provider error callback.
     */
    setCallbacks(onData, onError) {
        this.onDataCallback = onData;
        this.onErrorCallback = onError;
    }

    /**
     * Validate configuration before starting the provider.
     */
    initialize() {
        const validationError =
            validateConfig(this.config);

        if (validationError !== null) {
            this.reportError(validationError);
            return;
        }

        this.locationName =
            this.config.location.trim();

        this.initialized = true;
    }

    /**
     * Start fetching weather data.
     */
    start() {
        if (!this.initialized) {
            return;
        }

        this.stopped = false;

        const initialLoadDelay =
            Number.isFinite(this.config.initialLoadDelay) &&
            this.config.initialLoadDelay > 0
                ? this.config.initialLoadDelay
                : 0;

        if (initialLoadDelay > 0) {
            this.timer = this.timerApi.setTimeout(
                () => {
                    void this.updateWeather();
                },
                initialLoadDelay
            );

            return;
        }

        void this.updateWeather();
    }

    /**
     * Stop periodic updates and clear the active timer.
     */
    stop() {
        this.stopped = true;

        if (this.timer !== null) {
            this.timerApi.clearTimeout(this.timer);
            this.timer = null;
        }
    }

    /**
     * Fetch one weather update and deliver it to MagicMirror.
     *
     * @returns {Promise<void>}
     */
    async updateWeather() {
        if (
            this.stopped ||
            this.updateInProgress
        ) {
            return;
        }

        this.updateInProgress = true;

        try {
            const weather =
                await this.weatherService({
                    place: this.config.location.trim(),
                    latitude: this.config.lat,
                    longitude: this.config.lon,
                    timeZone: this.config.timezone.trim(),
                    type: this.config.type
                });

            if (this.stopped) {
                return;
            }

            const data = this.selectWeatherData(weather);

            if (typeof this.onDataCallback === "function") {
                this.onDataCallback(data);
            }
        } catch (error) {
            if (!this.stopped) {
                this.reportError(
                    error instanceof Error
                        ? error.message
                        : String(error)
                );
            }
        } finally {
            this.updateInProgress = false;

            if (!this.stopped) {
                this.scheduleNextUpdate();
            }
        }
    }

    /**
     * Select current or forecast data for the configured MagicMirror type.
     *
     * @param {{current: object|null, forecast: object[]}} weather
     * Combined MagicMirror weather data.
     * @returns {object|object[]} Data expected by the weather module.
     */
    selectWeatherData(weather) {
        if (this.config.type === "current") {
            if (weather.current === null) {
                throw new Error(
                    "FMI current weather data is unavailable"
                );
            }

            return weather.current;
        }

        if (
            !Array.isArray(weather.forecast) ||
            weather.forecast.length === 0
        ) {
            throw new Error(
                "FMI forecast data is unavailable"
            );
        }

        const maxDays =
            Number.isInteger(this.config.maxNumberOfDays) &&
            this.config.maxNumberOfDays > 0
                ? this.config.maxNumberOfDays
                : DEFAULT_MAX_FORECAST_DAYS;

        return weather.forecast.slice(
            0,
            maxDays
        );
    }

    /**
     * Schedule the next provider update.
     */
    scheduleNextUpdate() {
        const updateInterval =
            Number.isFinite(this.config.updateInterval) &&
            this.config.updateInterval >= 1000
                ? this.config.updateInterval
                : DEFAULT_UPDATE_INTERVAL;

        this.timer = this.timerApi.setTimeout(
            () => {
                void this.updateWeather();
            },
            updateInterval
        );
    }

    /**
     * Report an error through the MagicMirror provider callback.
     *
     * @param {string} message Human-readable error message.
     */
    reportError(message) {
        if (typeof this.onErrorCallback !== "function") {
            return;
        }

        this.onErrorCallback({
            message,
            translationKey:
                "MODULE_ERROR_UNSPECIFIED"
        });
    }
}

export default MagicMirrorFmiProvider;