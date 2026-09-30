// Deliberately read-only CLI. It cannot initialize, approve, run or recover a deployment.
import { OperationStore } from "./journal.mjs";
try {
  if (process.argv.length !== 3) throw new Error("arguments");
  console.log(JSON.stringify(new OperationStore(process.argv[2]).inspect()));
} catch {
  console.error("Deployment state unavailable; manual inspection required.");
  process.exitCode = 1;
}
