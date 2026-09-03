export class RssTrendError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RssTrendError";
    this.code = code;
  }
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function round(value) {
  return Number(value.toFixed(2));
}

export function evaluateRssTrend(
  samples,
  configuration,
  { supported = process.platform === "linux" } = {},
) {
  if (!supported) {
    return null;
  }

  const stableSamples = samples.filter(
    (sample) => sample.elapsedSeconds >= configuration.rssWarmupSeconds,
  );
  if (stableSamples.length < 6) {
    throw new RssTrendError(
      "rss_sampling_insufficient",
      "Too few post-warmup Linux RSS samples were collected.",
    );
  }

  const windowSize = Math.max(3, Math.floor(stableSamples.length * 0.2));
  const earlyMedianBytes = median(
    stableSamples.slice(0, windowSize).map((sample) => sample.rssBytes),
  );
  const lateMedianBytes = median(
    stableSamples.slice(-windowSize).map((sample) => sample.rssBytes),
  );
  const growthBytes = lateMedianBytes - earlyMedianBytes;
  const averageTime =
    stableSamples.reduce((sum, sample) => sum + sample.elapsedSeconds, 0) /
    stableSamples.length;
  const averageRss =
    stableSamples.reduce((sum, sample) => sum + sample.rssBytes, 0) /
    stableSamples.length;
  let covariance = 0;
  let timeVariance = 0;
  for (const sample of stableSamples) {
    const timeDelta = sample.elapsedSeconds - averageTime;
    covariance += timeDelta * (sample.rssBytes - averageRss);
    timeVariance += timeDelta ** 2;
  }
  if (timeVariance === 0) {
    throw new RssTrendError(
      "rss_sampling_insufficient",
      "Linux RSS samples lack a time range.",
    );
  }
  const slopeBytesPerMinute = (covariance / timeVariance) * 60;

  return {
    postWarmupSamples: stableSamples.length,
    windowSamples: windowSize,
    earlyMedianBytes,
    lateMedianBytes,
    growthBytes,
    slopeBytesPerMinute: round(slopeBytesPerMinute),
    growthLimitExceeded:
      growthBytes > configuration.maxRssGrowthMib * 1024 * 1024,
    slopeLimitExceeded:
      slopeBytesPerMinute >
      configuration.maxRssSlopeKibPerMinute * 1024,
  };
}

export function assertRssTrendWithinLimits(trend) {
  if (trend.growthLimitExceeded) {
    throw new RssTrendError(
      "rss_growth_exceeded",
      "Post-warmup RSS growth exceeded the configured plateau limit.",
    );
  }
  if (trend.slopeLimitExceeded) {
    throw new RssTrendError(
      "rss_trend_exceeded",
      "Post-warmup RSS retained an excessive upward trend.",
    );
  }
}
