#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const HOST = "127.0.0.1";
const ROUNDS = Number.parseInt(process.env.SMOKE_ROUNDS ?? "3", 10);
const MAX_LOG_LENGTH = 100_000;
const projectDirectory = fileURLToPath(new URL("..", import.meta.url));
const nextExecutable = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const PORT = await selectAvailablePort(process.env.SMOKE_PORT);
const baseUrl = `http://${HOST}:${PORT}`;
let serverLog = "";
let serverClosePromise;
let shutdownPromise = null;

if (!Number.isSafeInteger(ROUNDS) || ROUNDS < 1 || ROUNDS > 20) {
  throw new Error("SMOKE_ROUNDS must be between 1 and 20.");
}

function captureLog(chunk) {
  serverLog = `${serverLog}${chunk}`.slice(-MAX_LOG_LENGTH);
}

function redactSensitiveLog(value) {
  return Object.entries(process.env).reduce((redacted, [name, secret]) => {
    if (
      !/(?:CREDENTIAL|KEY|PASSWORD|SECRET|TOKEN)/i.test(name) ||
      typeof secret !== "string" ||
      secret.length < 6
    ) {
      return redacted;
    }

    return redacted.split(secret).join(`[redacted:${name}]`);
  }, value);
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function selectAvailablePort(rawPort) {
  const requestedPort = rawPort === undefined ? 0 : Number(rawPort);

  if (
    !Number.isSafeInteger(requestedPort) ||
    requestedPort < (rawPort === undefined ? 0 : 1024) ||
    requestedPort > 65_535
  ) {
    throw new Error("SMOKE_PORT must be an unprivileged TCP port.");
  }

  const probe = createServer();

  try {
    await new Promise((resolve, reject) => {
      probe.once("error", reject);
      probe.listen({ host: HOST, port: requestedPort, exclusive: true }, resolve);
    });

    const address = probe.address();
    assert.equal(typeof address, "object", "Unable to reserve a smoke-test port.");
    return address.port;
  } finally {
    if (probe.listening) {
      await new Promise((resolve, reject) => {
        probe.close((error) => (error ? reject(error) : resolve()));
      });
    }
  }
}

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...options,
    signal: AbortSignal.timeout(10_000),
  });
}

async function expectStatus(path, expectedStatus, options = {}) {
  const response = await request(path, options);
  assert.equal(
    response.status,
    expectedStatus,
    `${path} returned ${response.status}, expected ${expectedStatus}.`,
  );
  return response;
}

async function expectStatusAndConsume(path, expectedStatus, options = {}) {
  const response = await expectStatus(path, expectedStatus, options);
  await response.arrayBuffer();
  return response;
}

async function waitUntilReady(server) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null || server.signalCode !== null) {
      throw new Error(
        `Next.js exited before becoming ready (code ${server.exitCode ?? "none"}, signal ${server.signalCode ?? "none"}).`,
      );
    }

    try {
      const response = await request("/");
      if (response.status === 200) {
        await response.body?.cancel();
        await delay(100);

        if (server.exitCode !== null || server.signalCode !== null) {
          throw new Error(
            `Next.js exited during readiness (code ${server.exitCode ?? "none"}, signal ${server.signalCode ?? "none"}).`,
          );
        }

        return;
      }

      await response.body?.cancel();
    } catch {
      // The server may still be binding the socket.
    }

    await delay(250);
  }

  throw new Error("Next.js did not become ready within 30 seconds.");
}

async function readLinuxResidentMemory(pid) {
  if (process.platform !== "linux" || !Number.isSafeInteger(pid)) {
    return null;
  }

  try {
    const status = await readFile(`/proc/${pid}/status`, "utf8");
    return status.match(/^VmRSS:\s+(.+)$/m)?.[1] ?? null;
  } catch {
    return null;
  }
}

function stopServer(server) {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    let forceTimer;

    if (server.exitCode === null && server.signalCode === null) {
      server.kill("SIGTERM");
      forceTimer = setTimeout(() => {
        if (server.exitCode === null && server.signalCode === null) {
          server.kill("SIGKILL");
        }
      }, 5_000);
    }

    try {
      await serverClosePromise;
    } finally {
      clearTimeout(forceTimer);
    }
  })();

  return shutdownPromise;
}

const server = spawn(
  process.execPath,
  [nextExecutable, "start", "-H", HOST, "-p", String(PORT)],
  {
    cwd: projectDirectory,
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
serverClosePromise = new Promise((resolve) => server.once("close", resolve));

server.stdout.on("data", captureLog);
server.stderr.on("data", captureLog);

let relayedSignal = null;

function relaySignal(signal) {
  if (relayedSignal) {
    return;
  }

  relayedSignal = signal;
  const exitCode = signal === "SIGINT" ? 130 : 143;
  void stopServer(server).finally(() => process.exit(exitCode));
}

const handleSigint = () => relaySignal("SIGINT");
const handleSigterm = () => relaySignal("SIGTERM");
process.once("SIGINT", handleSigint);
process.once("SIGTERM", handleSigterm);

let failed = false;

try {
  await waitUntilReady(server);

  const priorityPages = [
    "/",
    "/servicii/strategie-marketing",
    "/case-studies",
    "/case-studies/optik-tataru",
    "/agentie-marketing/suceava",
  ];

  for (let round = 1; round <= ROUNDS; round += 1) {
    for (const path of priorityPages) {
      await expectStatusAndConsume(path, 200);
    }
  }

  const homePage = await expectStatusAndConsume("/", 200);
  const contentSecurityPolicy =
    homePage.headers.get("content-security-policy") ?? "";
  assert.match(
    contentSecurityPolicy,
    /(?:^|;)\s*frame-ancestors 'none'(?:;|$)/,
    "The production CSP must prevent framing.",
  );
  assert.equal(
    contentSecurityPolicy.includes("'unsafe-eval'"),
    false,
    "The production CSP must not allow unsafe-eval.",
  );
  assert.equal(homePage.headers.get("x-frame-options"), "DENY");
  assert.equal(homePage.headers.get("x-content-type-options"), "nosniff");

  await expectStatusAndConsume("/servicii/seo", 200);
  await expectStatusAndConsume("/blog", 200);
  await expectStatusAndConsume(
    "/blog/de-ce-marketingul-unei-companii-trebuie-sa-functioneze-ca-un-organism",
    200,
  );

  const sitemapResponse = await expectStatus("/sitemap.xml", 200);
  assert.match(
    sitemapResponse.headers.get("content-type") ?? "",
    /\b(?:application|text)\/xml\b/i,
    "The sitemap must be served as XML.",
  );
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /^<\?xml[\s\S]*<urlset\b/);
  assert.match(sitemap, /<\/urlset>\s*$/);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => url,
  );
  const parsedSitemapUrls = sitemapUrls.map((url) => new URL(url));
  assert.equal(sitemapUrls.length, 77, "The sitemap must contain 77 URLs.");
  assert.equal(
    (sitemap.match(/<url>/g) ?? []).length,
    sitemapUrls.length,
    "Every sitemap URL entry must contain one location.",
  );
  assert.equal(
    new Set(sitemapUrls).size,
    sitemapUrls.length,
    "The sitemap must not contain duplicate URLs.",
  );
  assert.equal(
    new Set(parsedSitemapUrls.map((url) => url.href)).size,
    parsedSitemapUrls.length,
    "The sitemap must not contain logically duplicate URLs.",
  );
  assert.equal(
    parsedSitemapUrls.every((parsedUrl) => {
      return (
        parsedUrl.protocol === "https:" &&
        parsedUrl.hostname === "digitaldot.ro" &&
        parsedUrl.port === "" &&
        parsedUrl.username === "" &&
        parsedUrl.password === "" &&
        parsedUrl.search === "" &&
        parsedUrl.hash === ""
      );
    }),
    true,
    "Every sitemap URL must use the canonical production origin.",
  );
  const legacySitemapPaths = [
    "/seo",
    "/social-media-management",
    "/productie-video",
    "/website-creation",
    "/servicii/strategie-de-marketing",
    "/portofoliu",
    "/contacteaza-ne",
  ];
  assert.equal(
    parsedSitemapUrls.some((url) => legacySitemapPaths.includes(url.pathname)),
    false,
    "The sitemap must not contain legacy aliases.",
  );
  const requiredSitemapPaths = [
    "/",
    "/servicii/strategie-marketing",
    "/servicii/seo",
    "/case-studies",
    "/case-studies/optik-tataru",
    "/agentie-marketing/suceava",
    "/blog",
    "/politica-confidentialitate",
    "/termeni-si-conditii",
  ];
  const sitemapPaths = new Set(parsedSitemapUrls.map((url) => url.pathname));
  assert.equal(
    requiredSitemapPaths.every((path) => sitemapPaths.has(path)),
    true,
    "The sitemap must contain every priority canonical route.",
  );

  for (const sitemapUrl of parsedSitemapUrls) {
    await expectStatusAndConsume(`${sitemapUrl.pathname}${sitemapUrl.search}`, 200);
  }

  const robotsResponse = await expectStatus("/robots.txt", 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /^User-Agent:/m);
  assert.match(robots, /^Sitemap: https:\/\/digitaldot\.ro\/sitemap\.xml$/m);
  assert.equal(robots.includes("localhost"), false);

  const llmsResponse = await expectStatus("/llms.txt", 200);
  assert.match(llmsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const llms = await llmsResponse.text();
  assert.match(llms, /^# Digital Dot$/m);
  assert.match(llms, /https:\/\/digitaldot\.ro\/servicii\/seo/);
  assert.equal(llms.includes("localhost"), false);

  const fullLlmsResponse = await expectStatus("/llms-full.txt", 200);
  assert.match(
    fullLlmsResponse.headers.get("content-type") ?? "",
    /^text\/plain\b/i,
  );
  const fullLlms = await fullLlmsResponse.text();
  assert.match(fullLlms, /^# Digital Dot LLM Context$/m);
  assert.match(fullLlms, /https:\/\/digitaldot\.ro\/sitemap\.xml/);
  assert.equal(fullLlms.includes("localhost"), false);
  assert.ok(fullLlms.length > llms.length, "The full LLM context must exceed the summary.");

  const permanentRedirects = [
    ["/seo?node24-smoke=1", "/servicii/seo", "?node24-smoke=1"],
    ["/social-media-management", "/servicii/social-media-management", ""],
    ["/productie-video", "/servicii/productie-foto-video", ""],
    ["/website-creation", "/servicii/website-creation", ""],
    [
      "/servicii/strategie-de-marketing",
      "/servicii/strategie-marketing",
      "",
    ],
  ];

  for (const [source, destination, expectedSearch] of permanentRedirects) {
    const redirect = await expectStatusAndConsume(source, 301);
    const location = redirect.headers.get("location");
    assert.ok(location, `${source} must return a Location header.`);
    const redirectTarget = new URL(location, baseUrl);
    assert.equal(redirectTarget.origin, baseUrl);
    assert.equal(redirectTarget.pathname, destination);
    assert.equal(redirectTarget.search, expectedSearch);
    assert.equal(redirectTarget.hash, "");
  }

  const privacyRedirect = await expectStatusAndConsume(
    "/politica-de-confidentialitate",
    308,
  );
  const privacyLocation = privacyRedirect.headers.get("location");
  assert.ok(
    privacyLocation,
    "/politica-de-confidentialitate must return a Location header.",
  );
  const privacyTarget = new URL(privacyLocation, baseUrl);
  assert.equal(privacyTarget.origin, baseUrl);
  assert.equal(privacyTarget.pathname, "/politica-confidentialitate");
  assert.equal(privacyTarget.search, "");
  assert.equal(privacyTarget.hash, "");

  const portfolioRedirect = await expectStatusAndConsume("/portofoliu", 308);
  const portfolioLocation = portfolioRedirect.headers.get("location");
  assert.ok(portfolioLocation, "/portofoliu must return a Location header.");
  const portfolioTarget = new URL(portfolioLocation, baseUrl);
  assert.equal(portfolioTarget.origin, baseUrl);
  assert.equal(portfolioTarget.pathname, "/case-studies");
  assert.equal(portfolioTarget.search, "");
  assert.equal(portfolioTarget.hash, "");

  const contactRedirect = await expectStatusAndConsume("/contacteaza-ne", 307);
  const contactLocation = contactRedirect.headers.get("location");
  assert.ok(contactLocation, "/contacteaza-ne must return a Location header.");
  const contactTarget = new URL(contactLocation, baseUrl);
  assert.equal(contactTarget.origin, baseUrl);
  assert.equal(contactTarget.pathname, "/");
  assert.equal(contactTarget.search, "");
  assert.equal(contactTarget.hash, "#contact");

  await expectStatusAndConsume("/panou-control", 200);
  await expectStatusAndConsume("/api/admin/site-content", 401);

  const session = await (
    await expectStatus("/api/admin/auth/session", 200)
  ).json();
  assert.deepEqual(session, { authenticated: false, configured: true });

  await expectStatusAndConsume("/api/admin/auth/login", 401, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "invalid", password: "invalid" }),
  });
  await expectStatusAndConsume("/api/contact", 400, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });

  const localImage = await expectStatusAndConsume(
    "/_next/image?url=%2Fbranding%2Flogo-primary.png&w=64&q=75",
    200,
  );
  assert.match(
    localImage.headers.get("content-type") ?? "",
    /^image\//,
    "The local image optimizer response must be an image.",
  );

  await expectStatusAndConsume(
    "/_next/image?url=https%3A%2F%2Fexample.com%2Fremote.png&w=64&q=75",
    400,
  );

  const residentMemory = await readLinuxResidentMemory(server.pid);
  console.log(
    `[smoke] ${ROUNDS} priority rounds and ${sitemapUrls.length} sitemap URLs passed on Node ${process.versions.node}` +
      (residentMemory ? `; server RSS ${residentMemory}.` : "."),
  );
} catch (error) {
  failed = true;
  console.error("[smoke] Production smoke test failed.");
  console.error(error);
} finally {
  try {
    await stopServer(server);
  } finally {
    process.removeListener("SIGINT", handleSigint);
    process.removeListener("SIGTERM", handleSigterm);
  }
}

if (failed) {
  console.error(
    "[smoke] Captured Next.js output:\n" + redactSensitiveLog(serverLog),
  );
  process.exit(1);
}
