/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: scripts/build-dist.mjs
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Build the standalone CommonJS distribution bundle for the built-in
 * MagicMirror² weather module.
 *
 * Workflow:
 * 1. Bundle the CommonJS MagicMirror entry point and all runtime dependencies.
 * 2. Target the Node.js runtime supported by current MagicMirror² releases.
 * 3. Remove trailing whitespace introduced by bundled third-party sources.
 * 4. Ensure the generated distribution file ends with one newline.
 */

import fs from "node:fs/promises";

import {
    build
} from "esbuild";

const outputFile = "dist/fmi.js";

await build({
    entryPoints: [
        "src/magicmirror-entry.cjs"
    ],
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node22",
    outfile: outputFile
});

const bundledSource =
    await fs.readFile(
        outputFile,
        "utf8"
    );

const cleanedSource =
    bundledSource
        .replace(/[ \t]+$/gm, "")
        .replace(/\s*$/, "\n");

await fs.writeFile(
    outputFile,
    cleanedSource,
    "utf8"
);