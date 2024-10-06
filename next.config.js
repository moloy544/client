/** @type {import('next').NextConfig} */

const nextConfig = {
  // this env set for client side access
  env: {
    APP_DOMAIN: 'https://www.moviesbazar.online',
    BACKEND_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://moviesbazar-api.vercel.app',
    VIDEO_SERVER_URL: 'https://ooat310wind.com/play/'
  },

  images: {
    domains: ['res.cloudinary.com', 'm.media-amazon.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig;