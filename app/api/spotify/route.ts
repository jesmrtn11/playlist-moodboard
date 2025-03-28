import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
    console.log('Token:', token);
  if (!token || !token.accessToken) {
    return NextResponse.json({ error: 'Not authenticated or token missing' }, { status: 401 });
  }

  try {
    const res = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Spotify API Error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch playlists', details: errorData }, { status: res.status });
    }

    const data = await res.json();
    console.log('Playlists!:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
