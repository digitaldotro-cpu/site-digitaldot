import type { NextConfig } from "next";

const marketingScripts = [
  "https://*.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googleadservices.com",
  "https://*.doubleclick.net",
  "https://connect.facebook.net",
  "https://*.facebook.com",
  "https://*.tiktok.com",
  "https://analytics.tiktok.com",
  "https://snap.licdn.com",
  "https://*.hotjar.com",
  "https://www.clarity.ms",
];

const marketingConnections = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://*.google.com",
  "https://*.doubleclick.net",
  "https://*.facebook.com",
  "https://*.tiktok.com",
  "https://px.ads.linkedin.com",
  "https://*.hotjar.com",
  "wss://*.hotjar.com",
  "https://*.clarity.ms",
];

const marketingFrames = [
  "https://*.googletagmanager.com",
  "https://*.doubleclick.net",
  "https://*.facebook.com",
];

const scriptSrc = process.env.NODE_ENV === "development"
  ? `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${marketingScripts.join(" ")}`
  : `script-src 'self' 'unsafe-inline' ${marketingScripts.join(" ")}`;

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' ${marketingConnections.join(" ")}`,
  `frame-src 'self' ${marketingFrames.join(" ")}`,
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/politica-de-confidentialitate",
        destination: "/politica-confidentialitate",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
