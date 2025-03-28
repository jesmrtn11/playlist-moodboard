import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  console.log('Refreshed Access Token!:', data.access_token);
  console.log('Dataaaa:', data);
  if (!res.ok || !data.access_token) {
    throw new Error('Failed to refresh access token');
  }

  return data.access_token;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  let accessToken = session.accessToken;
  const refreshToken = session.refreshToken;
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  // If the access token is expired, refresh it
  if (accessToken && isTokenExpired(accessToken)) {
    try {
      accessToken = await refreshAccessToken(refreshToken);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return res.status(500).json({ error: 'Failed to refresh access token' });
    }
  }

  // Fetch playlists
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    console.log('Playlists!:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

function isTokenExpired(token: string): boolean {
  // Decode the JWT token and check the expiration
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  const currentTime = Date.now() / 1000;
  return currentTime >= payload.exp;
}

export default handler;
