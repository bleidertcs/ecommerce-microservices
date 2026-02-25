// API Configuration
// For server components: uses NEXT_PUBLIC_API_URL from environment
// For client components: uses NEXT_PUBLIC_API_URL that is inlined at build time

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';
