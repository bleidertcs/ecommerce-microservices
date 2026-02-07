import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const authentikUrl = process.env.AUTHENTIK_URL || 'http://localhost:9000';
    const clientId = process.env.AUTHENTIK_CLIENT_ID;
    const clientSecret = process.env.AUTHENTIK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing AUTHENTIK_CLIENT_ID or AUTHENTIK_CLIENT_SECRET');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const body = new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'openid profile email',
      redirect_uri: 'http://localhost:3000' // Must match what's in Authentik
    });

    const res = await fetch(`${authentikUrl}/application/o/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error_description || 'Authentication failed' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
