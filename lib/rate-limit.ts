type Bucket = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

type RateLimitOptions = {
  scope: string;
  key: string;
  max: number;
  windowMs: number;
  blockMs?: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();

function now() {
  return Date.now();
}

function toBucketId(scope: string, key: string) {
  return `${scope}:${key}`;
}

function cleanupExpiredBuckets(currentTime: number) {
  for (const [bucketId, bucket] of buckets.entries()) {
    if (bucket.blockedUntil <= currentTime && currentTime - bucket.windowStart > 10 * 60 * 1000) {
      buckets.delete(bucketId);
    }
  }
}

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const currentTime = now();
  cleanupExpiredBuckets(currentTime);

  const blockMs = options.blockMs ?? options.windowMs;
  const bucketId = toBucketId(options.scope, options.key);
  const existingBucket = buckets.get(bucketId);

  if (existingBucket && existingBucket.blockedUntil > currentTime) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existingBucket.blockedUntil - currentTime) / 1000)),
    };
  }

  if (!existingBucket || currentTime - existingBucket.windowStart >= options.windowMs) {
    buckets.set(bucketId, {
      count: 1,
      windowStart: currentTime,
      blockedUntil: 0,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const nextCount = existingBucket.count + 1;
  if (nextCount > options.max) {
    const blockedUntil = currentTime + blockMs;
    buckets.set(bucketId, {
      count: nextCount,
      windowStart: existingBucket.windowStart,
      blockedUntil,
    });

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(blockMs / 1000)),
    };
  }

  buckets.set(bucketId, {
    count: nextCount,
    windowStart: existingBucket.windowStart,
    blockedUntil: 0,
  });

  return { allowed: true, retryAfterSeconds: 0 };
}

export function readPositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

