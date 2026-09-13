/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: src/magicmirror-entry.cjs
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * CommonJS entry point for the built-in MagicMirror² weather provider loader.
 *
 * Workflow:
 * 1. Import the bundled provider implementation.
 * 2. Export the provider class directly through module.exports.
 */

const {
    MagicMirrorFmiProvider
} = require("./magicmirror-provider.js");

module.exports = MagicMirrorFmiProvider;