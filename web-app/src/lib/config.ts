// API Configuration
// For server components (SSR): we need an internal URL reachable within the Docker network
// For client components (Browser): we use the public URL (Kong Gateway)

// Internal URL for Server-Side Rendering (Only used in Node.js)
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || 'http://kong:8000';

// Public URL for Client-Side Requests (Used in the browser)
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

// Check if we are running on the server or client
const isServer = typeof window === 'undefined';

export const API_BASE_URL = isServer ? INTERNAL_API_URL : PUBLIC_API_URL;
