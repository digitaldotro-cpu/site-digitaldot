import assert from "node:assert/strict";
import test from "node:test";

import {
  RssTrendError,
  assertRssTrendWithinLimits,
  evaluateRssTrend,
} from "./soak-rss.mjs";

const MIB = 1024 * 1024;
const KIB = 1024;
const configuration = Object.freeze({
  rssWarmupSeconds: 0,
  maxRssGrowthMib: 64,
  maxRssSlopeKibPerMinute: 512,
});

function linearSamples(bytesPerMinute, count = 6) {
  return Array.from({ length: count }, (_, index) => ({
    elapsedSeconds: index * 60,
    rssBytes: 100 * MIB + index * bytesPerMinute,
  }));
}

test("returns null when Linux RSS sampling is unavailable", () => {
  assert.equal(
    evaluateRssTrend([], configuration, { supported: false }),
    null,
  );
});

test("returns the full plateau metrics for a stable trend", () => {
  const trend = evaluateRssTrend(linearSamples(0), configuration, {
    supported: true,
  });

  assert.deepEqual(trend, {
    postWarmupSamples: 6,
    windowSamples: 3,
    earlyMedianBytes: 100 * MIB,
    lateMedianBytes: 100 * MIB,
    growthBytes: 0,
    slopeBytesPerMinute: 0,
    growthLimitExceeded: false,
    slopeLimitExceeded: false,
  });
  assert.doesNotThrow(() => assertRssTrendWithinLimits(trend));
});

test("accepts a slope exactly at the configured limit", () => {
  const trend = evaluateRssTrend(linearSamples(512 * KIB), configuration, {
    supported: true,
  });

  assert.equal(trend.slopeBytesPerMinute, 512 * KIB);
  assert.equal(trend.slopeLimitExceeded, false);
  assert.doesNotThrow(() => assertRssTrendWithinLimits(trend));
});

test("preserves metrics before rejecting a slope above the limit", () => {
  const trend = evaluateRssTrend(linearSamples(512 * KIB + 1), configuration, {
    supported: true,
  });

  assert.equal(trend.slopeLimitExceeded, true);
  assert.ok(Number.isFinite(trend.earlyMedianBytes));
  assert.ok(Number.isFinite(trend.lateMedianBytes));
  assert.ok(Number.isFinite(trend.growthBytes));
  assert.ok(Number.isFinite(trend.slopeBytesPerMinute));
  assert.throws(
    () => assertRssTrendWithinLimits(trend),
    (error) =>
      error instanceof RssTrendError && error.code === "rss_trend_exceeded",
  );
});

test("accepts growth exactly at the configured limit", () => {
  const samples = [
    ...Array.from({ length: 3 }, (_, index) => ({
      elapsedSeconds: index * 60,
      rssBytes: 100 * MIB,
    })),
    ...Array.from({ length: 3 }, (_, index) => ({
      elapsedSeconds: (index + 3) * 60,
      rssBytes: 164 * MIB,
    })),
  ];
  const trend = evaluateRssTrend(samples, configuration, { supported: true });

  assert.equal(trend.growthBytes, 64 * MIB);
  assert.equal(trend.growthLimitExceeded, false);
});

test("preserves metrics before rejecting growth above the limit", () => {
  const samples = [
    ...Array.from({ length: 3 }, (_, index) => ({
      elapsedSeconds: index * 60,
      rssBytes: 100 * MIB,
    })),
    ...Array.from({ length: 3 }, (_, index) => ({
      elapsedSeconds: (index + 3) * 60,
      rssBytes: 164 * MIB + 1,
    })),
  ];
  const trend = evaluateRssTrend(samples, configuration, { supported: true });

  assert.equal(trend.growthBytes, 64 * MIB + 1);
  assert.equal(trend.growthLimitExceeded, true);
  assert.throws(
    () => assertRssTrendWithinLimits(trend),
    (error) =>
      error instanceof RssTrendError && error.code === "rss_growth_exceeded",
  );
});

test("rejects too few post-warmup samples", () => {
  assert.throws(
    () =>
      evaluateRssTrend(linearSamples(0, 5), configuration, {
        supported: true,
      }),
    (error) =>
      error instanceof RssTrendError &&
      error.code === "rss_sampling_insufficient",
  );
});

test("rejects samples without a time range", () => {
  const samples = Array.from({ length: 6 }, () => ({
    elapsedSeconds: 60,
    rssBytes: 100 * MIB,
  }));

  assert.throws(
    () => evaluateRssTrend(samples, configuration, { supported: true }),
    (error) =>
      error instanceof RssTrendError &&
      error.code === "rss_sampling_insufficient",
  );
});
