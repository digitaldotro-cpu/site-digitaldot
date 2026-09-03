#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`[toolchain] ${message}`);
  process.exit(1);
}

const expectedNodeVersion = readFileSync(new URL("../.nvmrc", import.meta.url), "utf8").trim();
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const expectedNpmVersion = packageJson.packageManager?.match(/^npm@(\d+\.\d+\.\d+)$/)?.[1];

if (!/^\d+\.\d+\.\d+$/.test(expectedNodeVersion)) {
  fail(".nvmrc must contain one exact semantic version.");
}

if (!expectedNpmVersion) {
  fail("packageManager must pin one exact npm version.");
}

if (packageJson.engines?.node !== expectedNodeVersion) {
  fail("package.json engines.node must match .nvmrc exactly.");
}

if (packageJson.engines?.npm !== expectedNpmVersion) {
  fail("package.json engines.npm must match packageManager exactly.");
}

const actualNodeVersion = process.versions.node;
const actualNpmVersion = execFileSync("npm", ["--version"], {
  encoding: "utf8",
}).trim();

if (actualNodeVersion !== expectedNodeVersion) {
  fail(`Expected Node ${expectedNodeVersion}, received ${actualNodeVersion}.`);
}

if (actualNpmVersion !== expectedNpmVersion) {
  fail(`Expected npm ${expectedNpmVersion}, received ${actualNpmVersion}.`);
}

console.log(`[toolchain] Node ${actualNodeVersion} and npm ${actualNpmVersion} verified.`);
