import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@opentelemetry/api",
    "@opentelemetry/sdk-trace-web",
    "@opentelemetry/sdk-trace-base",
    "@opentelemetry/exporter-trace-otlp-http",
    "@opentelemetry/resources",
    "@opentelemetry/semantic-conventions",
    "@opentelemetry/instrumentation",
    "@opentelemetry/instrumentation-fetch",
    "@opentelemetry/instrumentation-xml-http-request",
    "@opentelemetry/context-zone",
  ],
  // Allow external API calls during development
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth/).*)",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
