const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Spotify image domain
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com', // Additional Spotify image domain
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co', // Mosaic Spotify image domain
      },
    ],
  },
};

export default nextConfig;
