import NextAuth, { NextAuthOptions, Session, JWT } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

// Custom JWT type to define accessToken and refreshToken
interface CustomJWT extends JWT {
  accessToken?: string;
  refreshToken: string;
  accessTokenExpires?: number;
  error?: 'RefreshAccessTokenError' | null; // Updated type for stricter control
}

// Custom session type to ensure correct type for accessToken and refreshToken
interface CustomSession extends Session {
  accessToken?: string;
  refreshToken: string;
  error?: 'RefreshAccessTokenError' | null; // Updated type for stricter control
}

// Function to refresh access token
async function refreshAccessToken(token: CustomJWT) {
  if (!token.refreshToken) {
    console.error('No refresh token available. Forcing logout.');
    return { ...token, error: 'RefreshAccessTokenError' };
  }

  console.log('Refreshing token with refresh_token:', token.refreshToken);
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }).toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // Set expiration time
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token if none returned
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private',
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      const customToken = token as unknown as CustomJWT;
      console.log('Current token state!!!!!!:', customToken);
      // Check if account is available (on sign-in)
      if (account) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token || token.refreshToken || '', // Ensure refreshToken is preserved
          accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
        };
      }

      // If the token is expired, refresh it
      if (Date.now() > (customToken.accessTokenExpires || 0)) {
        return await refreshAccessToken(customToken); // Refresh the token
      }

      // Return the token if it's still valid
      return token;
    },

    async session({ session, token }) {
      const customToken = token as unknown as CustomJWT;
      
      session.accessToken = customToken.accessToken;
      session.refreshToken = customToken.refreshToken || '';
      
      if (customToken.error) {
        (session as CustomSession).error = customToken.error; // Type assertion for session
      }
    
      return session as CustomSession;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour, which matches the Spotify access token expiration time
  },
} as NextAuthOptions);

export { handler as GET, handler as POST };
