/**
 * Centralized Casdoor configuration for client-side usage.
 * 
 * These values are read from NEXT_PUBLIC_ environment variables at build time.
 * Using a centralized config module ensures all components use consistent values
 * and provides clear fallback defaults.
 */

export const casdoorConfig = {
  /** Casdoor base URL accessible from the browser */
  url: process.env.NEXT_PUBLIC_CASDOOR_URL || 'http://localhost:8000',

  /** OAuth2 Client ID registered in Casdoor */
  clientId: process.env.NEXT_PUBLIC_CASDOOR_CLIENT_ID || 'de01a6da141873d09ac8',

  /** Casdoor organization name */
  organization: process.env.NEXT_PUBLIC_CASDOOR_ORGANIZATION || 'built-in',

  /** Casdoor application name */
  application: process.env.NEXT_PUBLIC_CASDOOR_APPLICATION || 'app-built-in',

  /** OAuth2 redirect URI after login/signup */
  redirectUri: process.env.NEXT_PUBLIC_CASDOOR_REDIRECT_URI || 'http://localhost:3000/callback',
} as const;

/**
 * Build the Casdoor OAuth2 authorization URL for login.
 */
export function getCasdoorLoginUrl(state = 'lumina'): string {
  const { url, clientId, redirectUri, organization, application } = casdoorConfig;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
    organization,
    application,
  });
  return `${url}/login/oauth/authorize?${params.toString()}`;
}

/**
 * Build the Casdoor OAuth2 authorization URL for signup.
 */
export function getCasdoorSignupUrl(state = 'lumina'): string {
  const { url, clientId, redirectUri, organization, application } = casdoorConfig;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
    organization,
    application,
  });
  return `${url}/signup/oauth/authorize?${params.toString()}`;
}
