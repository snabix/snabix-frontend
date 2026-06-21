import type { NextConfig } from "next";

type SecurityHeadersOptions = {
  apiUrl?: string;
  environment: "development" | "production" | "test";
};

type ImageRemotePattern = {
  hostname: string;
  pathname: string;
  port: string;
  protocol: "http" | "https";
};

function getApiOrigin(apiUrl: string | undefined): string | null {
  if (!apiUrl) {
    return null;
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    throw new Error(
      "NEXT_PUBLIC_API_URL must contain an absolute URL to configure the Content Security Policy.",
    );
  }
}

export function createImageRemotePatterns(
  apiUrl: string | undefined,
): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = [
    {
      hostname: "images.unsplash.com",
      pathname: "/**",
      port: "",
      protocol: "https",
    },
  ];

  if (!apiUrl) {
    return patterns;
  }

  const parsedApiUrl = new URL(apiUrl);

  if (parsedApiUrl.protocol !== "http:" && parsedApiUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_API_URL must use the HTTP or HTTPS protocol.");
  }

  patterns.push({
    hostname: parsedApiUrl.hostname,
    pathname: "/**",
    port: parsedApiUrl.port,
    protocol: parsedApiUrl.protocol.slice(0, -1) as "http" | "https",
  });

  return patterns;
}

export function createContentSecurityPolicy({
  apiUrl,
  environment,
}: SecurityHeadersOptions): string {
  const apiOrigin = getApiOrigin(apiUrl);
  const isDevelopment = environment === "development";
  const scriptSources = ["'self'", "'unsafe-inline'"];
  const connectSources = ["'self'"];
  const remoteMediaSources = apiOrigin ? [apiOrigin, "https:"] : ["https:"];

  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
    connectSources.push("ws:", "wss:");
  }

  if (apiOrigin) {
    connectSources.push(apiOrigin);
  }

  return [
    ["default-src", "'self'"],
    ["base-uri", "'self'"],
    ["connect-src", ...connectSources],
    ["font-src", "'self'", "data:"],
    ["form-action", "'self'"],
    ["frame-ancestors", "'none'"],
    ["img-src", "'self'", "data:", "blob:", ...remoteMediaSources],
    ["manifest-src", "'self'"],
    ["media-src", "'self'", "blob:", ...remoteMediaSources],
    ["object-src", "'none'"],
    ["script-src", ...scriptSources],
    ["style-src", "'self'", "'unsafe-inline'"],
    ["worker-src", "'self'", "blob:"],
  ]
    .map((directive) => directive.join(" "))
    .join("; ");
}

export function createSecurityHeaders({
  apiUrl,
  environment,
}: SecurityHeadersOptions) {
  const headers = [
    {
      key: "Content-Security-Policy",
      value: createContentSecurityPolicy({ apiUrl, environment }),
    },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
    { key: "X-XSS-Protection", value: "0" },
  ];

  if (environment === "production") {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
  }

  return headers;
}

const environment =
  process.env.NODE_ENV === "development" ? "development" : "production";
const securityHeaders = createSecurityHeaders({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  environment,
});

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        headers: securityHeaders,
        source: "/:path*",
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: environment === "development",
    maximumRedirects: 0,
    remotePatterns: createImageRemotePatterns(process.env.NEXT_PUBLIC_API_URL),
  },
};

export default nextConfig;
