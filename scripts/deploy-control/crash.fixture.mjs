// Test worker only: exits intentionally while retaining its test journal lock.
import { OperationStore } from "./journal.mjs";
import { plan, forward, rollback } from "./fixtures.mjs";
const [root, phase] = process.argv.slice(2);
try {
  const store = new OperationStore(root);
  const result = store.begin(plan());
  if (result.status !== "admitted") throw new Error("unexpected-replay");
  if (phase === "contend") { console.log("admitted"); process.exit(0); }
  if (phase !== "admitted") {
    const route = rollback.includes(phase) ? [...forward.slice(0,4), ...rollback] : forward;
    if (!route.includes(phase)) throw new Error("bad-test-phase");
    for (const next of route) { store.advance(result.lease, next); if (next === phase) break; }
  }
  process.exit(23);
} catch { console.log("refused"); process.exit(24); }
