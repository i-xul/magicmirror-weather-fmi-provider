/**
 * Author: H A (i-xul)
 * Repository: https://github.com/i-xul/magicmirror-weather-fmi-provider
 * File: test/timezone.test.js
 * Created: 2026-09-13
 * Version: 0.1.0
 *
 * Purpose:
 * Verify conversion of UTC weather timestamps into local calendar date and
 * time components using explicit IANA time zones.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    getLocalDateTimeParts
} from "../src/timezone.js";

test("converts UTC timestamp to Helsinki summer time", () => {
    const local = getLocalDateTimeParts(
        "2026-09-13T21:30:00Z",
        "Europe/Helsinki"
    );

    assert.deepEqual(local, {
        dateKey: "2026-09-14",
        year: 2026,
        month: 9,
        day: 14,
        hour: 0,
        minute: 30,
        second: 0
    });
});

test("converts UTC timestamp to Helsinki winter time", () => {
    const local = getLocalDateTimeParts(
        "2026-12-21T10:15:00Z",
        "Europe/Helsinki"
    );

    assert.deepEqual(local, {
        dateKey: "2026-12-21",
        year: 2026,
        month: 12,
        day: 21,
        hour: 12,
        minute: 15,
        second: 0
    });
});

test("keeps UTC calendar time when UTC time zone is used", () => {
    const local = getLocalDateTimeParts(
        "2026-09-13T21:30:45Z",
        "UTC"
    );

    assert.deepEqual(local, {
        dateKey: "2026-09-13",
        year: 2026,
        month: 9,
        day: 13,
        hour: 21,
        minute: 30,
        second: 45
    });
});

test("accepts Date objects", () => {
    const date = new Date("2026-09-13T09:00:00Z");

    const local = getLocalDateTimeParts(
        date,
        "Europe/Helsinki"
    );

    assert.equal(local.dateKey, "2026-09-13");
    assert.equal(local.hour, 12);
});

test("rejects invalid timestamps", () => {
    assert.throws(
        () => getLocalDateTimeParts(
            "not-a-date",
            "Europe/Helsinki"
        ),
        {
            name: "TypeError",
            message: "Timestamp must be a valid date"
        }
    );
});

test("rejects invalid time-zone values", () => {
    assert.throws(
        () => getLocalDateTimeParts(
            "2026-09-13T12:00:00Z",
            ""
        ),
        {
            name: "TypeError",
            message: "Time zone must be a non-empty string"
        }
    );

    assert.throws(
        () => getLocalDateTimeParts(
            "2026-09-13T12:00:00Z",
            "Invalid/TimeZone"
        ),
        RangeError
    );
});