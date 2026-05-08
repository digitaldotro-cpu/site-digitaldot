const required = ["ADMIN_DASHBOARD_KEY", "ADMIN_SESSION_SECRET"];
const enforce =
  process.env.CI === "true" ||
  process.env.NODE_ENV === "production" ||
  process.env.ENFORCE_ADMIN_ENV === "true";

if (!enforce) {
  process.exit(0);
}

const missing = required.filter((name) => {
  const value = process.env[name];
  return typeof value !== "string" || value.trim().length === 0;
});

if (missing.length > 0) {
  console.error(
    `[security-env] Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`,
  );
  process.exit(1);
}

