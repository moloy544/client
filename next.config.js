/** @type {import('next').NextConfig} */

module.exports = {
  // this env set for client side access
  env: {
    APP_DOMAIN: 'https://moviesbazar.online',
    BACKEND_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://moviesbazaar-api.vercel.app',
    VIDEO_SERVER_URL: 'https://loner300artoa.com/play/'
  },

  images: {
    domains: ['res.cloudinary.com', 'm.media-amazon.com'],
    unoptimized: true,
  },
}