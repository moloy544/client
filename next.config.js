/** @type {import('next').NextConfig} */

module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'm.media-amazon.com',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  }