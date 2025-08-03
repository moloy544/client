/** @type {import('next').NextConfig} */

const nextConfig = {
 
  // this env set for client side access
  env: {
    APP_VERSION: '18.4.0',
    DOMAIN: 'https://www.moviesbazar.net',
    API_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://moviesbazar-api-v8.vercel.app',
    VIDEO_SERVER_URL: 'https://dezzu370xol.com/play/', 
    SECOND_VIDEO_SERVER_URL: 'https://errie369djj.com/play/'
  },

  images: {
    domains: ['res.cloudinary.com', 'm.media-amazon.com', 'media.themoviedb.org'],
    unoptimized: true,
  },
}

module.exports = nextConfig;
