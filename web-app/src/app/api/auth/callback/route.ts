import { NextResponse } from 'next/server';

/** Timeout for Casdoor token exchange (ms). Prevents login from hanging. */
const CASDOOR_FETCH_TIMEOUT_MS = 15_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const casdoorEndpoint = process.env.CASDOOR_ENDPOINT || 'http://casdoor:8000';
    const clientId = process.env.CASDOOR_CLIENT_ID;
    const clientSecret = process.env.CASDOOR_CLIENT_SECRET;

    const tokenUrl = new URL(`${casdoorEndpoint}/api/login/oauth/access_token`);
    tokenUrl.searchParams.append('grant_type', 'authorization_code');
    tokenUrl.searchParams.append('client_id', clientId || '');
    tokenUrl.searchParams.append('client_secret', clientSecret || '');
    tokenUrl.searchParams.append('code', code);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CASDOOR_FETCH_TIMEOUT_MS);

    const res = await fetch(tokenUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      console.error('Casdoor token exchange error:', data);
      return NextResponse.json({ error: 'Failed to exchange code for token', detail: data }, { status: 500 });
    }

    // Sync user to backend in background — do not block the response.
    // The client gets the token immediately; sync completes asynchronously.
    const { API_BASE_URL: apiUrl } = await import('@/lib/config');
    fetch(`${apiUrl}/api/v1/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.access_token}`,
      },
    })
      .then((syncRes) => {
        if (!syncRes.ok) {
          return syncRes.text().then((text) => {
            console.error('Failed to sync user to backend:', text);
          });
        }
        console.log('User synchronized successfully to backend.');
      })
      .catch((syncError) => {
        console.error('Error during user synchronization:', syncError);
      });

    return NextResponse.json({
      token: data.access_token,
      id_token: data.id_token,
      refresh_token: data.refresh_token,
    });
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === 'AbortError') {
      console.error('Casdoor token exchange timed out');
      return NextResponse.json({ error: 'Login timed out. Please try again.' }, { status: 504 });
    }
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
