#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { performance } from "node:perf_hooks";
import { dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import {
  RssTrendError,
  assertRssTrendWithinLimits,
  evaluateRssTrend,
} from "./soak-rss.mjs";

const HOST = "127.0.0.1";
const MAX_LOG_LENGTH = 100_000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const STARTUP_TIMEOUT_MS = 45_000;
const SHUTDOWN_GRACE_MS = 5_000;
const DUMMY_ENVIRONMENT = Object.freeze({
  ADMIN_DASHBOARD_KEY: "ci-only-dashboard-key-not-for-production",
  ADMIN_SESSION_SECRET: "ci-only-session-secret-not-for-production-use",
});
const DOTENV_FILES_LOADED_BY_NEXT = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
];
const projectDirectory = fileURLToPath(new URL("..", import.meta.url));
const nextExecutable = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

class SoakError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "SoakError";
    this.code = code;
  }
}

function readBoundedInteger(name, fallback, minimum, maximum) {
  const rawValue = process.env[name] ?? String(fallback);

  if (!/^(?:0|[1-9]\d*)$/.test(rawValue)) {
    throw new SoakError("invalid_configuration", `${name} must be an integer.`);
  }

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new SoakError(
      "invalid_configuration",
      `${name} must be between ${minimum} and ${maximum}.`,
    );
  }

  return value;
}

const durationSeconds = readBoundedInteger(
  "SOAK_DURATION_SECONDS",
  process.env.CI === "true" ? 7_200 : 60,
  60,
  7_200,
);
const rssWarmupSeconds = readBoundedInteger(
  "SOAK_RSS_WARMUP_SECONDS",
  Math.min(600, Math.max(15, Math.floor(durationSeconds / 12))),
  0,
  3_600,
);
if (rssWarmupSeconds > durationSeconds - 10) {
  throw new SoakError(
    "invalid_configuration",
    "SOAK_RSS_WARMUP_SECONDS must leave at least 10 seconds for trend sampling.",
  );
}

const configuration = Object.freeze({
  durationSeconds,
  requestsPerSecond: readBoundedInteger(
    "SOAK_REQUESTS_PER_SECOND",
    4,
    1,
    20,
  ),
  concurrency: readBoundedInteger("SOAK_CONCURRENCY", 8, 1, 32),
  requestTimeoutMs: readBoundedInteger(
    "SOAK_REQUEST_TIMEOUT_MS",
    10_000,
    1_000,
    30_000,
  ),
  rssSampleIntervalSeconds: readBoundedInteger(
    "SOAK_RSS_SAMPLE_INTERVAL_SECONDS",
    5,
    1,
    60,
  ),
  maxRssMib: readBoundedInteger("SOAK_MAX_RSS_MIB", 1_536, 128, 4_096),
  rssWarmupSeconds,
  maxRssGrowthMib: readBoundedInteger(
    "SOAK_MAX_RSS_GROWTH_MIB",
    64,
    16,
    1_024,
  ),
  maxRssSlopeKibPerMinute: readBoundedInteger(
    "SOAK_MAX_RSS_SLOPE_KIB_PER_MINUTE",
    512,
    64,
    65_536,
  ),
});

const routePlan = [
  { id: "home", path: "/", kind: "html" },
  { id: "home", path: "/", kind: "html" },
  { id: "home", path: "/", kind: "html" },
  {
    id: "strategy",
    path: "/servicii/strategie-marketing",
    kind: "html",
  },
  {
    id: "strategy",
    path: "/servicii/strategie-marketing",
    kind: "html",
  },
  { id: "case-studies", path: "/case-studies", kind: "html" },
  { id: "case-studies", path: "/case-studies", kind: "html" },
  {
    id: "case-study",
    path: "/case-studies/optik-tataru",
    kind: "html",
  },
  {
    id: "regional-page",
    path: "/agentie-marketing/suceava",
    kind: "html",
  },
  { id: "blog", path: "/blog", kind: "html" },
  { id: "sitemap", path: "/sitemap.xml", kind: "sitemap" },
  { id: "robots", path: "/robots.txt", kind: "robots" },
  {
    id: "admin-session",
    path: "/api/admin/auth/session",
    kind: "session",
  },
  {
    id: "admin-session",
    path: "/api/admin/auth/session",
    kind: "session",
  },
  {
    id: "image-optimizer",
    path: "/_next/image?url=%2Fbranding%2Flogo-primary.png&w=64&q=75",
    kind: "image",
  },
  {
    id: "image-optimizer",
    path: "/_next/image?url=%2Fbranding%2Flogo-landscape-turcoaz-dot-white-stroke.png&w=128&q=75",
    kind: "image",
  },
  {
    id: "image-optimizer",
    path: "/_next/image?url=%2Fbranding%2Fteam%2Flucian-filip.jpg&w=256&q=75",
    kind: "image",
  },
];

function expectedContentType(kind) {
  switch (kind) {
    case "html":
      return /^text\/html\b/i;
    case "sitemap":
      return /\b(?:application|text)\/xml\b/i;
    case "robots":
      return /^text\/plain\b/i;
    case "session":
      return /^application\/json\b/i;
    case "image":
      return /^image\//i;
    default:
      throw new SoakError("invalid_route", "The request plan is invalid.");
  }
}

function validateBody(route, body) {
  if (body.length === 0) {
    throw new SoakError("invalid_body", `${route.id} returned an empty body.`);
  }

  if (route.kind === "image") {
    if (body.length < 32) {
      throw new SoakError("invalid_body", "The optimized image is incomplete.");
    }
    return;
  }

  const text = body.toString("utf8");
  switch (route.kind) {
    case "html":
      if (!/<html(?:\s|>)/i.test(text) || !/<\/html>\s*$/i.test(text)) {
        throw new SoakError("invalid_body", `${route.id} returned invalid HTML.`);
      }
      break;
    case "sitemap":
      if (!/<urlset\b/i.test(text) || !/<loc>https:\/\/digitaldot\.ro\//i.test(text)) {
        throw new SoakError("invalid_body", "The sitemap body is invalid.");
      }
      break;
    case "robots":
      if (!/^User-Agent:/m.test(text) || !/^Sitemap: https:\/\/digitaldot\.ro\/sitemap\.xml$/m.test(text)) {
        throw new SoakError("invalid_body", "The robots body is invalid.");
      }
      break;
    case "session": {
      let session;
      try {
        session = JSON.parse(text);
      } catch {
        throw new SoakError("invalid_body", "The session response is not JSON.");
      }
      if (
        session?.authenticated !== false ||
        session?.configured !== true ||
        Object.keys(session).length !== 2
      ) {
        throw new SoakError("invalid_body", "The session response is unsafe.");
      }
      break;
    }
    default:
      throw new SoakError("invalid_route", "The request plan is invalid.");
  }
}

async function assertNoRuntimeDotenvFiles() {
  for (const name of DOTENV_FILES_LOADED_BY_NEXT) {
    try {
      await access(join(projectDirectory, name));
    } catch (error) {
      if (error?.code === "ENOENT") {
        continue;
      }
      throw new SoakError("dotenv_check_failed", "Unable to verify dotenv isolation.");
    }

    throw new SoakError(
      "unsafe_environment",
      "Refusing to start Next.js while a runtime dotenv file is present.",
    );
  }
}

async function selectAvailablePort() {
  const requestedPort =
    process.env.SOAK_PORT === undefined
      ? 0
      : readBoundedInteger("SOAK_PORT", 0, 1_024, 65_535);
  const probe = createServer();

  try {
    await new Promise((resolve, reject) => {
      probe.once("error", reject);
      probe.listen({ host: HOST, port: requestedPort, exclusive: true }, resolve);
    });
    const address = probe.address();
    if (!address || typeof address === "string") {
      throw new SoakError("port_selection_failed", "Unable to select a local port.");
    }
    return address.port;
  } finally {
    if (probe.listening) {
      await new Promise((resolve) => probe.close(resolve));
    }
  }
}

function childEnvironment(port) {
  const environment = {
    PATH:
      process.env.PATH ??
      `${dirname(process.execPath)}${process.platform === "win32" ? ";" : ":"}/usr/bin:/bin`,
    CI: "true",
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    PORT: String(port),
    ...DUMMY_ENVIRONMENT,
  };

  for (const name of ["LANG", "LC_ALL", "TZ", "TMPDIR", "TMP", "TEMP"]) {
    if (typeof process.env[name] === "string") {
      environment[name] = process.env[name];
    }
  }

  return environment;
}

function sanitize(value) {
  let sanitized = String(value)
    .replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  for (const [name, secret] of Object.entries(process.env)) {
    if (
      /(?:CREDENTIAL|KEY|PASSWORD|SECRET|TOKEN)/i.test(name) &&
      typeof secret === "string" &&
      secret.length >= 6
    ) {
      sanitized = sanitized.split(secret).join(`[redacted:${name}]`);
    }
  }

  for (const [name, value] of Object.entries(DUMMY_ENVIRONMENT)) {
    sanitized = sanitized.split(value).join(`[dummy:${name}]`);
  }

  return sanitized.replaceAll("::", "∷").slice(0, MAX_LOG_LENGTH);
}

async function readBodyLimited(response) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    await response.body?.cancel();
    throw new SoakError("body_too_large", "A response exceeded the body limit.");
  }
  if (!response.body) {
    throw new SoakError("invalid_body", "A response did not contain a body.");
  }

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  let complete = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        complete = true;
        break;
      }
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        throw new SoakError("body_too_large", "A response exceeded the body limit.");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    if (!complete) {
      await reader.cancel().catch(() => {});
    }
  }

  return Buffer.concat(chunks, total);
}

async function loadCanonicalRoutes() {
  let response;
  try {
    response = await fetch(`${baseUrl}/sitemap.xml`, {
      redirect: "manual",
      signal: AbortSignal.timeout(configuration.requestTimeoutMs),
    });
  } catch {
    throw new SoakError(
      "sitemap_unavailable",
      "The local sitemap could not be loaded for the soak plan.",
    );
  }
  if (response.status !== 200) {
    await response.body?.cancel();
    throw new SoakError(
      "invalid_status",
      `sitemap returned HTTP ${response.status} while preparing the soak plan.`,
    );
  }

  const body = await readBodyLimited(response);
  validateBody({ id: "sitemap", kind: "sitemap" }, body);
  const locations = [
    ...body.toString("utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map(([, location]) => location);
  if (locations.length === 0 || new Set(locations).size !== locations.length) {
    throw new SoakError(
      "invalid_sitemap",
      "The sitemap must contain unique canonical URLs.",
    );
  }

  return locations.map((location) => {
    let url;
    try {
      url = new URL(location);
    } catch {
      throw new SoakError("invalid_sitemap", "The sitemap contains an invalid URL.");
    }
    if (
      url.protocol !== "https:" ||
      url.hostname !== "digitaldot.ro" ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== "" ||
      url.search !== "" ||
      url.hash !== ""
    ) {
      throw new SoakError(
        "invalid_sitemap",
        "The sitemap contains a non-canonical URL.",
      );
    }
    return { id: "canonical-pages", path: url.pathname, kind: "html" };
  });
}

async function readProcessSample(pid) {
  if (process.platform !== "linux") {
    return null;
  }

  let status;
  let stat;
  try {
    [status, stat] = await Promise.all([
      readFile(`/proc/${pid}/status`, "utf8"),
      readFile(`/proc/${pid}/stat`, "utf8"),
    ]);
  } catch {
    throw new SoakError("server_disappeared", "The Next.js process disappeared.");
  }

  const rssKib = Number(status.match(/^VmRSS:\s+(\d+)\s+kB$/m)?.[1]);
  const closingParenthesis = stat.lastIndexOf(")");
  const statFields = stat.slice(closingParenthesis + 2).split(/\s+/);
  const startTicks = statFields[19];
  if (!Number.isSafeInteger(rssKib) || rssKib < 0 || !/^\d+$/.test(startTicks ?? "")) {
    throw new SoakError("rss_unavailable", "Linux RSS sampling failed.");
  }

  return { rssBytes: rssKib * 1_024, startTicks };
}

async function findMemoryEventsPath() {
  if (process.platform !== "linux") {
    return null;
  }
  try {
    const cgroups = await readFile(`/proc/${process.pid}/cgroup`, "utf8");
    const unified = cgroups.split(/\r?\n/).find((line) => line.startsWith("0::"));
    if (!unified) {
      return null;
    }
    const relativePath = unified.slice(3).replace(/^\/+/, "");
    const path = join("/sys/fs/cgroup", relativePath, "memory.events");
    await access(path);
    return path;
  } catch {
    return null;
  }
}

async function readMemoryEvents(path) {
  if (!path) {
    return null;
  }
  try {
    const entries = {};
    for (const line of (await readFile(path, "utf8")).trim().split(/\r?\n/)) {
      const [name, rawValue] = line.split(/\s+/);
      const value = Number(rawValue);
      if (name && Number.isSafeInteger(value) && value >= 0) {
        entries[name] = value;
      }
    }
    return entries;
  } catch {
    return null;
  }
}

function percentile(values, fraction) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

function round(value) {
  return Number(value.toFixed(2));
}

function abortableDelay(milliseconds, signal) {
  return delay(milliseconds, undefined, { signal, ref: false }).catch((error) => {
    if (signal.aborted) {
      throw signal.reason;
    }
    throw error;
  });
}

await assertNoRuntimeDotenvFiles();
const port = await selectAvailablePort();
const baseUrl = `http://${HOST}:${port}`;
const runController = new AbortController();
const routeStatistics = new Map(
  [...new Set(routePlan.map((route) => route.id))].map((id) => [
    id,
    { id, requests: 0, bytes: 0 },
  ]),
);
const latencies = [];
const rssSamples = [];
const expectedCanonicalPaths = new Set();
const coveredCanonicalPaths = new Set();
let requestFailures = 0;
let serverLog = "";
let fatalError = null;
let expectedShutdown = false;
let stopPromise = null;
let loadStartedAt = null;
let loadFinishedAt = null;
let initialStartTicks = null;
let serverExit = null;
let shutdownRequiredForce = false;
let shutdownReport = null;

function failRun(error) {
  if (fatalError) {
    return;
  }
  fatalError =
    error instanceof SoakError
      ? error
      : new SoakError("unexpected_failure", "The soak test failed unexpectedly.");
  runController.abort(fatalError);
}

function captureServerLog(chunk) {
  const text = String(chunk);
  serverLog = `${serverLog}${text}`.slice(-MAX_LOG_LENGTH);
  if (
    /FATAL ERROR|heap out of memory|\bENOMEM\b|uncaughtException|UnhandledPromiseRejection/i.test(
      serverLog.slice(-4_096),
    )
  ) {
    failRun(new SoakError("server_fatal_log", "Next.js emitted a fatal error."));
  }
}

const server = spawn(
  process.execPath,
  [nextExecutable, "start", "-H", HOST, "-p", String(port)],
  {
    cwd: projectDirectory,
    detached: process.platform !== "win32",
    env: childEnvironment(port),
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", captureServerLog);
server.stderr.on("data", captureServerLog);
server.once("error", () => {
  failRun(new SoakError("server_spawn_failed", "Unable to start Next.js."));
});
const serverClosePromise = new Promise((resolve) => {
  server.once("close", (code, signal) => {
    serverExit = { code, signal };
    if (!expectedShutdown) {
      failRun(
        new SoakError(
          signal === "SIGKILL" ? "server_killed" : "server_crashed",
          "Next.js exited before the soak test completed.",
        ),
      );
    }
    resolve();
  });
});

function killServer(signal) {
  if (!server.pid || server.exitCode !== null || server.signalCode !== null) {
    return;
  }
  try {
    if (process.platform === "win32") {
      server.kill(signal);
    } else {
      process.kill(-server.pid, signal);
    }
  } catch (error) {
    if (error?.code !== "ESRCH") {
      throw error;
    }
  }
}

function stopServer() {
  if (stopPromise) {
    return stopPromise;
  }
  expectedShutdown = true;
  stopPromise = (async () => {
    killServer("SIGTERM");
    await Promise.race([
      serverClosePromise,
      delay(SHUTDOWN_GRACE_MS, undefined, { ref: false }),
    ]);
    if (server.exitCode === null && server.signalCode === null) {
      shutdownRequiredForce = true;
      killServer("SIGKILL");
      await Promise.race([
        serverClosePromise,
        delay(SHUTDOWN_GRACE_MS, undefined, { ref: false }),
      ]);
    }
    if (server.exitCode === null && server.signalCode === null) {
      throw new SoakError("cleanup_failed", "Next.js did not stop during cleanup.");
    }
    if (shutdownRequiredForce) {
      throw new SoakError(
        "unclean_shutdown",
        "Next.js required SIGKILL during cleanup.",
      );
    }
    const exitedForRequestedSigterm =
      serverExit?.signal === "SIGTERM" || serverExit?.code === 143;
    if (serverExit?.code !== 0 && !exitedForRequestedSigterm) {
      throw new SoakError(
        "unclean_shutdown",
        "Next.js exited abnormally during cleanup.",
      );
    }
  })();
  return stopPromise;
}

let receivedSignal = null;
function handleSignal(signal) {
  if (receivedSignal) {
    expectedShutdown = true;
    killServer("SIGKILL");
    process.exit(signal === "SIGINT" ? 130 : 143);
  }
  receivedSignal = signal;
  failRun(new SoakError("interrupted", `The soak test received ${signal}.`));
}
const handleSigint = () => handleSignal("SIGINT");
const handleSigterm = () => handleSignal("SIGTERM");
process.once("SIGINT", handleSigint);
process.once("SIGTERM", handleSigterm);

async function waitUntilReady() {
  const deadline = performance.now() + STARTUP_TIMEOUT_MS;
  while (performance.now() < deadline) {
    if (fatalError) {
      throw fatalError;
    }
    try {
      const response = await fetch(`${baseUrl}/`, {
        redirect: "manual",
        signal: AbortSignal.timeout(2_000),
      });
      await response.body?.cancel();
      if (response.status === 200) {
        return;
      }
    } catch {
      // Binding the loopback socket can take a few seconds.
    }
    await delay(250);
  }
  throw new SoakError("startup_timeout", "Next.js did not become ready in time.");
}

async function executeRequest(route) {
  const timeoutSignal = AbortSignal.timeout(configuration.requestTimeoutMs);
  const signal = AbortSignal.any([runController.signal, timeoutSignal]);
  const startedAt = performance.now();
  let response;
  try {
    response = await fetch(`${baseUrl}${route.path}`, {
      headers: {
        accept:
          route.kind === "image"
            ? "image/avif,image/webp,image/*"
            : "text/html,application/json,application/xml,text/plain;q=0.9,*/*;q=0.1",
        "cache-control": "no-cache",
        "user-agent": "digitaldot-node24-soak/1",
      },
      redirect: "manual",
      signal,
    });
  } catch {
    if (runController.signal.aborted) {
      throw runController.signal.reason;
    }
    throw new SoakError(
      timeoutSignal.aborted ? "request_timeout" : "request_failed",
      `${route.id} did not return a response.`,
    );
  }

  if (response.status !== 200) {
    await response.body?.cancel();
    throw new SoakError(
      "invalid_status",
      `${route.id} returned HTTP ${response.status}.`,
    );
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!expectedContentType(route.kind).test(contentType)) {
    await response.body?.cancel();
    throw new SoakError(
      "invalid_content_type",
      `${route.id} returned an unexpected content type.`,
    );
  }

  const body = await readBodyLimited(response);
  validateBody(route, body);
  const latency = performance.now() - startedAt;
  latencies.push(latency);
  const statistics = routeStatistics.get(route.id);
  statistics.requests += 1;
  statistics.bytes += body.length;
  if (route.id === "canonical-pages") {
    coveredCanonicalPaths.add(route.path);
  }
}

async function runLoad() {
  const intervalMs = 1_000 / configuration.requestsPerSecond;
  const active = new Set();
  loadStartedAt = performance.now();
  const deadline = loadStartedAt + configuration.durationSeconds * 1_000;
  let nextLaunchAt = loadStartedAt;
  let requestIndex = 0;

  const launch = (route) => {
    let task;
    task = executeRequest(route)
      .catch((error) => {
        if (!fatalError) {
          requestFailures += 1;
          failRun(error);
        }
      })
      .finally(() => active.delete(task));
    active.add(task);
  };

  while (performance.now() < deadline) {
    if (fatalError) {
      throw fatalError;
    }
    if (active.size >= configuration.concurrency) {
      await Promise.race(active);
      continue;
    }

    const now = performance.now();
    if (now < nextLaunchAt) {
      await abortableDelay(Math.min(nextLaunchAt - now, deadline - now), runController.signal);
      continue;
    }

    launch(routePlan[requestIndex % routePlan.length]);
    requestIndex += 1;
    nextLaunchAt = Math.max(nextLaunchAt + intervalMs, performance.now() + intervalMs);
  }

  await Promise.all(active);
  loadFinishedAt = performance.now();
  if (fatalError) {
    throw fatalError;
  }

  const minimumRequests = Math.floor(
    configuration.durationSeconds * configuration.requestsPerSecond * 0.9,
  );
  if (latencies.length < minimumRequests) {
    throw new SoakError(
      "rate_not_sustained",
      `Only ${latencies.length} of at least ${minimumRequests} requests completed.`,
    );
  }
  if (coveredCanonicalPaths.size !== expectedCanonicalPaths.size) {
    throw new SoakError(
      "canonical_coverage_incomplete",
      "The soak plan did not exercise every canonical sitemap route.",
    );
  }
}

const memoryEventsPath = await findMemoryEventsPath();
const initialMemoryEvents = await readMemoryEvents(memoryEventsPath);
let samplingTimer = null;
let samplingChain = Promise.resolve();
let progressTimer = null;
let overallTimer = null;
let resultError = null;
let rssTrend = null;

async function sampleRss() {
  if (!server.pid || process.platform !== "linux") {
    return;
  }
  const sample = await readProcessSample(server.pid);
  if (initialStartTicks === null) {
    initialStartTicks = sample.startTicks;
  } else if (sample.startTicks !== initialStartTicks) {
    throw new SoakError("server_restarted", "The Next.js process restarted.");
  }
  rssSamples.push({
    elapsedSeconds:
      loadStartedAt === null
        ? 0
        : Math.max(0, (performance.now() - loadStartedAt) / 1_000),
    rssBytes: sample.rssBytes,
  });
  if (sample.rssBytes > configuration.maxRssMib * 1024 * 1024) {
    throw new SoakError("rss_limit_exceeded", "Next.js exceeded the RSS limit.");
  }
}

try {
  overallTimer = setTimeout(
    () => failRun(new SoakError("overall_timeout", "The soak test exceeded its time budget.")),
    configuration.durationSeconds * 1_000 + STARTUP_TIMEOUT_MS + configuration.requestTimeoutMs + 15_000,
  );

  await waitUntilReady();
  const canonicalRoutes = await loadCanonicalRoutes();
  for (const route of canonicalRoutes) {
    expectedCanonicalPaths.add(route.path);
  }
  routePlan.push(...canonicalRoutes);
  routeStatistics.set("canonical-pages", {
    id: "canonical-pages",
    requests: 0,
    bytes: 0,
  });
  await sampleRss();
  samplingTimer = setInterval(() => {
    samplingChain = samplingChain.then(sampleRss).catch(failRun);
  }, configuration.rssSampleIntervalSeconds * 1_000);
  progressTimer = setInterval(() => {
    const latestRss = rssSamples.at(-1)?.rssBytes;
    console.log(
      `[soak] progress requests=${latencies.length} failures=${requestFailures}` +
        (latestRss ? ` rss_mib=${round(latestRss / 1024 / 1024)}` : ""),
    );
  }, 300_000);

  await runLoad();
  clearInterval(samplingTimer);
  samplingTimer = null;
  await samplingChain;
  await sampleRss();
  rssTrend = evaluateRssTrend(rssSamples, configuration);
  if (rssTrend) {
    assertRssTrendWithinLimits(rssTrend);
  }
} catch (error) {
  resultError =
    error instanceof SoakError
      ? error
      : error instanceof RssTrendError
        ? new SoakError(error.code, error.message)
      : fatalError ??
        new SoakError("unexpected_failure", "The soak test failed unexpectedly.");
} finally {
  clearTimeout(overallTimer);
  clearInterval(samplingTimer);
  clearInterval(progressTimer);
  await samplingChain;
  resultError ??= fatalError;
  let shutdownError = null;
  try {
    await stopServer();
  } catch (error) {
    shutdownError =
      error instanceof SoakError
        ? error
        : new SoakError("cleanup_failed", "Next.js cleanup failed.");
  }
  shutdownReport = {
    attempted: true,
    clean: shutdownError === null,
    requiredForce: shutdownRequiredForce,
    exitCode: serverExit?.code ?? null,
    signal: serverExit?.signal ?? null,
    failure: shutdownError
      ? {
          code: shutdownError.code,
          message: sanitize(shutdownError.message).slice(0, 500),
        }
      : null,
  };
  resultError ??= fatalError;
  resultError ??= shutdownError;
  process.removeListener("SIGINT", handleSigint);
  process.removeListener("SIGTERM", handleSigterm);
}

const finalMemoryEvents = await readMemoryEvents(memoryEventsPath);
const oomDeltas = {};
for (const name of ["oom", "oom_kill", "oom_group_kill"]) {
  const initial = initialMemoryEvents?.[name];
  const final = finalMemoryEvents?.[name];
  if (Number.isSafeInteger(initial) && Number.isSafeInteger(final)) {
    oomDeltas[name] = final - initial;
    if (final > initial) {
      resultError ??= new SoakError("oom_detected", "The Linux cgroup reported an OOM event.");
    }
  }
}

const elapsedSeconds =
  loadStartedAt === null
    ? 0
    : ((loadFinishedAt ?? performance.now()) - loadStartedAt) / 1_000;
const rssValues = rssSamples.map((sample) => sample.rssBytes);
const rssMinimum = rssValues.length > 0 ? Math.min(...rssValues) : null;
const rssMaximum = rssValues.length > 0 ? Math.max(...rssValues) : null;
const report = {
  schemaVersion: 2,
  result: resultError ? "failure" : "success",
  nodeVersion: process.versions.node,
  configuration: {
    durationSeconds: configuration.durationSeconds,
    requestsPerSecond: configuration.requestsPerSecond,
    concurrency: configuration.concurrency,
    requestTimeoutMs: configuration.requestTimeoutMs,
    maxRssMib: configuration.maxRssMib,
    rssWarmupSeconds: configuration.rssWarmupSeconds,
    maxRssGrowthMib: configuration.maxRssGrowthMib,
    maxRssSlopeKibPerMinute: configuration.maxRssSlopeKibPerMinute,
  },
  observed: {
    elapsedSeconds: round(elapsedSeconds),
    requests: latencies.length,
    requestFailures,
    achievedRequestsPerSecond:
      elapsedSeconds > 0 ? round(latencies.length / elapsedSeconds) : 0,
    latencyMs: {
      p50: percentile(latencies, 0.5) === null ? null : round(percentile(latencies, 0.5)),
      p95: percentile(latencies, 0.95) === null ? null : round(percentile(latencies, 0.95)),
      p99: percentile(latencies, 0.99) === null ? null : round(percentile(latencies, 0.99)),
      max:
        latencies.length > 0
          ? round(latencies.reduce((maximum, value) => Math.max(maximum, value), 0))
          : null,
    },
    routes: [...routeStatistics.values()],
    canonicalRoutes: {
      expected: expectedCanonicalPaths.size,
      covered: coveredCanonicalPaths.size,
    },
    linuxRss: {
      supported: process.platform === "linux",
      samples: rssSamples.length,
      firstBytes: rssSamples[0]?.rssBytes ?? null,
      finalBytes: rssSamples.at(-1)?.rssBytes ?? null,
      minimumBytes: rssMinimum,
      maximumBytes: rssMaximum,
      plateau: rssTrend,
    },
    cgroupOomDelta: Object.keys(oomDeltas).length > 0 ? oomDeltas : null,
    shutdown: shutdownReport,
  },
  failure: resultError
    ? { code: resultError.code, message: sanitize(resultError.message).slice(0, 500) }
    : null,
};

console.log(`[soak] ${JSON.stringify(report)}`);
if (resultError) {
  if (serverLog.trim()) {
    const safeLog = sanitize(serverLog)
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => `[soak-server] ${line}`)
      .join("\n");
    console.error(safeLog);
  }
  process.exitCode = receivedSignal === "SIGINT" ? 130 : receivedSignal === "SIGTERM" ? 143 : 1;
} else if (serverExit && !expectedShutdown) {
  process.exitCode = 1;
}
