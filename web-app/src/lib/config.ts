/**
 * API URLs for different environments.
 * - Server-side (SSR) uses the internal Docker network.
 * - Client-side (browser) uses the public consumer URL.
 */

// Use INTERNAL_API_URL if on server, otherwise use NEXT_PUBLIC_API_URL
export const API_BASE_URL = typeof window === "undefined"
  ? (process.env.INTERNAL_API_URL || "http://signoz-otel-collector:8010").replace(/\/$/, "")
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010").replace(/\/$/, "");

console.log(`[Config] Using API_BASE_URL: ${API_BASE_URL} (${typeof window === "undefined" ? "Server" : "Client"})`);
