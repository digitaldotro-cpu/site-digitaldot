import { reviewLostSupervisor } from "./recovery-review.mjs";
if (process.argv.length !== 3) {
  console.error("Exactly one existing journal directory is required. No changes performed.");
  process.exitCode = 64;
} else {
  const result = reviewLostSupervisor(process.argv[2]);
  console.log(JSON.stringify(result));
  // Exit zero only means the historical journal has no outstanding fence,
  // never a healthy deployment or permission to publish.
  process.exitCode = result.disposition === "idle-not-live-verified" ? 0 : 2;
}
