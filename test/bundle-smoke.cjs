/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/bundle-smoke.cjs
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify that the distributable MagicMirror² provider bundle exports the
 * provider class directly through CommonJS.
 *
 * Workflow:
 * 1. Copy dist/fmi.js to a temporary .cjs filename for local testing.
 * 2. Load the bundle with require().
 * 3. Verify that the export is directly constructible.
 * 4. Remove the temporary file.
 */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(
    __dirname,
    ".."
);

const bundlePath = path.join(
    repositoryRoot,
    "dist",
    "fmi.js"
);

const temporaryBundlePath = path.join(
    repositoryRoot,
    "dist",
    "fmi-smoke.cjs"
);

try {
    assert.equal(
        fs.existsSync(bundlePath),
        true,
        "dist/fmi.js must exist before running the bundle smoke test"
    );

    fs.copyFileSync(
        bundlePath,
        temporaryBundlePath
    );

    const Provider = require(
        temporaryBundlePath
    );

    assert.equal(
        typeof Provider,
        "function"
    );

    assert.equal(
        Provider.name,
        "MagicMirrorFmiProvider"
    );

    const provider = new Provider({
        location: "Helsinki",
        lat: 60.1699,
        lon: 24.9384,
        timezone: "Europe/Helsinki",
        type: "current"
    });

    assert.equal(
        provider.constructor.name,
        "MagicMirrorFmiProvider"
    );

    console.log(
        "MagicMirror provider bundle smoke test passed"
    );
} finally {
    if (
        fs.existsSync(
            temporaryBundlePath
        )
    ) {
        fs.unlinkSync(
            temporaryBundlePath
        );
    }
}