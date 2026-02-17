import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const casdoorEndpoint = process.env.CASDOOR_ENDPOINT || 'http://localhost:8000';
    const clientId = process.env.CASDOOR_CLIENT_ID;
    const clientSecret = process.env.CASDOOR_CLIENT_SECRET;
    const organization = process.env.CASDOOR_ORGANIZATION || 'built-in';
    const application = process.env.CASDOOR_APPLICATION || 'app-built-in';

    if (!clientId || !clientSecret) {
      console.error('Missing CASDOOR_CLIENT_ID or CASDOOR_CLIENT_SECRET');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Use Resource Owner Password Credentials Grant
    const body = new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'openid profile email',
    });

    const res = await fetch(`${casdoorEndpoint}/api/login/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Casdoor auth error:', data);
      return NextResponse.json({ 
        error: data.error_description || data.error || 'Authentication failed' 
      }, { status: 401 });
    }

    // Return the JWT token to the client
    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
