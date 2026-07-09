import {
  createContentSecurityPolicy,
  createImageRemotePatterns,
  createSecurityHeaders,
  optimizedImageFormats,
} from "./next.config";

describe("Next.js security headers", () => {
  it("restricts production resources and allows the configured API origin", () => {
    const policy = createContentSecurityPolicy({
      apiUrl: "https://api.snabix.test/api/v1",
      environment: "production",
    });

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("connect-src 'self' https://api.snabix.test");
    expect(policy).toContain(
      "img-src 'self' data: blob: https://api.snabix.test https:",
    );
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).not.toContain("ws:");
  });

  it("allows Next.js development tooling without weakening production", () => {
    const policy = createContentSecurityPolicy({
      apiUrl: "http://localhost:8080/api/v1",
      environment: "development",
    });

    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(policy).toContain(
      "connect-src 'self' ws: wss: http://localhost:8080",
    );
    expect(policy).toContain(
      "img-src 'self' data: blob: http://localhost:8080 https: http://127.0.0.1:8080",
    );
  });

  it("adds HSTS only to production responses", () => {
    const productionHeaders = createSecurityHeaders({
      environment: "production",
    });
    const developmentHeaders = createSecurityHeaders({
      environment: "development",
    });

    expect(productionHeaders).toContainEqual({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
    expect(developmentHeaders).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "Strict-Transport-Security" }),
      ]),
    );
  });
});

describe("Next.js image sources", () => {
  it("negotiates AVIF before WebP for optimized media", () => {
    expect(optimizedImageFormats).toEqual(["image/avif", "image/webp"]);
  });

  it("allows only the configured API origin and the editorial image host in production", () => {
    expect(
      createImageRemotePatterns("http://localhost:8080/api/v1"),
    ).toEqual([
      {
        hostname: "images.unsplash.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "localhost",
        pathname: "/**",
        port: "8080",
        protocol: "http",
      },
    ]);
  });

  it("allows both loopback hostnames for local backend media", () => {
    expect(
      createImageRemotePatterns(
        "http://localhost:8080/api/v1",
        "development",
      ),
    ).toEqual([
      {
        hostname: "images.unsplash.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "localhost",
        pathname: "/**",
        port: "8080",
        protocol: "http",
      },
      {
        hostname: "127.0.0.1",
        pathname: "/**",
        port: "8080",
        protocol: "http",
      },
    ]);
  });
});
