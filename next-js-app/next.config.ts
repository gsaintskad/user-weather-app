const nextConfig = {
  // This line is essential for a production Docker build
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
  },
};

module.exports = nextConfig;
