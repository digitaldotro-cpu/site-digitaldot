// Test child process. Input contains synthetic signed records and PUBLIC keys only.
import fs from "node:fs";
import { createPublicKey } from "node:crypto";
import { archiveRecoveryConclusion } from "./recovery-receipt-archive.mjs";
const [root, fault] = process.argv.slice(2);
const input = JSON.parse(fs.readFileSync(0, "utf8"));
const trust = Object.fromEntries(Object.entries(input.trust).map(([k, v]) => [k, createPublicKey(v)]));
const mkdir = fs.mkdirSync, write = fs.writeFileSync; let writes = 0;
fs.mkdirSync = (...args) => { const v = mkdir(...args); if (fault === "after-reserve") process.exit(22); return v; };
fs.writeFileSync = (...args) => { const v = write(...args); writes++;
  if ((fault === "after-packet" && writes === 1) || (fault === "after-marker" && writes === 2)) process.exit(23);
  return v;
};
try { archiveRecoveryConclusion(root, input.context, input.events, trust); console.log("recorded"); }
catch { console.log("refused-or-uncertain"); process.exitCode = 24; }
