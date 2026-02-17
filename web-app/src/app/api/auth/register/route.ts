import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, email, password, firstName, lastName } = await request.json();

    const casdoorEndpoint = process.env.CASDOOR_ENDPOINT || 'http://localhost:8000';
    const clientId = process.env.CASDOOR_CLIENT_ID;
    const clientSecret = process.env.CASDOOR_CLIENT_SECRET;
    const organization = process.env.CASDOOR_ORGANIZATION || 'built-in';
    
    // Casdoor API Token is optional if we use ClientID/ClientSecret in query params
    // but we'll try to use it if provided.
    const apiToken = process.env.CASDOOR_API_TOKEN && process.env.CASDOOR_API_TOKEN !== 'casdoor_api_token_placeholder' 
        ? process.env.CASDOOR_API_TOKEN 
        : null;

    // Construct the Casdoor User object
    const newUser = {
      owner: organization,
      name: username,
      displayName: `${firstName} ${lastName}`,
      password: password,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      type: 'normal-user',
      isAdmin: false,
      isGlobalAdmin: false,
      isForbidden: false,
      signupApplication: process.env.CASDOOR_APPLICATION || 'app-built-in',
    };

    // Construct URL with auth params
    const url = new URL(`${casdoorEndpoint}/api/add-user`);
    url.searchParams.append('clientId', clientId || '');
    url.searchParams.append('clientSecret', clientSecret || '');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // Attempting to create user via Casdoor API
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(newUser),
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'ok') {
      console.error('Casdoor registration error:', data);
      return NextResponse.json({ 
        error: data.msg || 'Failed to create user in Casdoor',
        detail: data.data 
      }, { status: res.status === 200 ? 400 : res.status });
    }

    return NextResponse.json({ success: true, user: data.data });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
