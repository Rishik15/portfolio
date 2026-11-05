import assert from "node:assert/strict";
import { test } from "node:test";

import { createPlayQuota } from "./quota.ts";
import { signStreamToken, verifyStreamToken } from "./stream-token.ts";

const JAN = Date.UTC(2026, 0, 15);
const FEB = Date.UTC(2026, 1, 2);

test("quota allows the limit then blocks with next month reset", () => {
    const quota = createPlayQuota({ limit: 3, maxEntries: 10 });

    for (let i = 0; i < 3; i++) {
        assert.deepEqual(quota.consume("a", JAN), { ok: true });
    }

    assert.deepEqual(quota.consume("a", JAN), {
        ok: false,
        resetsAt: Date.UTC(2026, 1, 1),
    });
    assert.deepEqual(quota.consume("b", JAN), { ok: true });
});

test("quota resets on the UTC month boundary", () => {
    const quota = createPlayQuota({ limit: 1, maxEntries: 10 });

    quota.consume("a", JAN);

    assert.equal(quota.consume("a", JAN).ok, false);
    assert.equal(quota.consume("a", FEB).ok, true);
});

test("quota evicts the oldest key at the entry cap", () => {
    const quota = createPlayQuota({ limit: 1, maxEntries: 2 });

    quota.consume("a", JAN);
    quota.consume("b", JAN);
    quota.consume("c", JAN);

    assert.equal(quota.consume("a", JAN).ok, true);
    assert.equal(quota.consume("c", JAN).ok, false);
});

test("token verifies only for same track, ip, before expiry", () => {
    const token = signStreamToken("secret", {
        trackId: "t1",
        ip: "1.1.1.1",
        expiresAt: 1000,
    });
    const good = { trackId: "t1", ip: "1.1.1.1", now: 999 };

    assert.equal(verifyStreamToken("secret", token, good), true);
    assert.equal(verifyStreamToken("secret", token, { ...good, now: 1000 }), false);
    assert.equal(verifyStreamToken("secret", token, { ...good, trackId: "t2" }), false);
    assert.equal(verifyStreamToken("secret", token, { ...good, ip: "2.2.2.2" }), false);
    assert.equal(verifyStreamToken("other", token, good), false);
    assert.equal(verifyStreamToken("secret", `x${token}`, good), false);
    assert.equal(verifyStreamToken("secret", "garbage", good), false);
});
