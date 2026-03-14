import { NextResponse } from 'next/server';

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

    // Exchange code for token
    const tokenUrl = new URL(`${casdoorEndpoint}/api/login/oauth/access_token`);
    tokenUrl.searchParams.append('grant_type', 'authorization_code');
    tokenUrl.searchParams.append('client_id', clientId || '');
    tokenUrl.searchParams.append('client_secret', clientSecret || '');
    tokenUrl.searchParams.append('code', code);

    const res = await fetch(tokenUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      console.error('Casdoor token exchange error:', data);
      return NextResponse.json({ error: 'Failed to exchange code for token', detail: data }, { status: 500 });
    }

    // Trigger User Synchronization to backend
    try {
      // Use internal Docker network to reach Kong API Gateway when running in Docker,
      // or fall back to the same base URL used by the frontend when running locally.
      const apiUrl =
        process.env.INTERNAL_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:8010';
      const syncRes = await fetch(`${apiUrl}/api/v1/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      if (!syncRes.ok) {
        console.error('Failed to sync user to backend:', await syncRes.text());
        // We choose not to fail the login if sync fails, but log it
      } else {
        console.log('User synchronized successfully to backend.');
      }
    } catch (syncError) {
      console.error('Error during user synchronization:', syncError);
    }

    return NextResponse.json({
      token: data.access_token,
      id_token: data.id_token,
      refresh_token: data.refresh_token
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
