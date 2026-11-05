import assert from "node:assert/strict";
import { test } from "node:test";

import {
    createOrder,
    getAdjacentIndex,
    getEndedAction,
    getNextRepeatMode,
} from "./music-queue.ts";

test("order is identity without shuffle", () => {
    assert.deepEqual(createOrder(4, false, 2), [0, 1, 2, 3]);
});

test("shuffled order is a permutation starting at the current track", () => {
    const order = createOrder(5, true, 3, () => 0.5);

    assert.equal(order[0], 3);
    assert.deepEqual([...order].sort(), [0, 1, 2, 3, 4]);
});

test("adjacent index wraps both ways", () => {
    assert.equal(getAdjacentIndex([0, 1, 2], 2, 1), 0);
    assert.equal(getAdjacentIndex([0, 1, 2], 0, -1), 2);
});

test("ended action follows repeat mode", () => {
    const order = [0, 1, 2];

    assert.deepEqual(getEndedAction(order, 1, "one"), { type: "replay" });
    assert.deepEqual(getEndedAction(order, 2, "all"), { type: "play", index: 0 });
    assert.deepEqual(getEndedAction(order, 2, "off"), { type: "stop" });
    assert.deepEqual(getEndedAction(order, 0, "off"), { type: "play", index: 1 });
});

test("repeat cycles off, all, one", () => {
    assert.equal(getNextRepeatMode("off"), "all");
    assert.equal(getNextRepeatMode("all"), "one");
    assert.equal(getNextRepeatMode("one"), "off");
});
