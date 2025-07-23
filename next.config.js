/** @type {import('next').NextConfig} */

const nextConfig = {
 
  // this env set for client side access
  env: {
    APP_VERSION: '6.4.0',
    DOMAIN: 'https://www.moviesbazar.net',
    API_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://moviesbazar-api-v8.vercel.app',
    VIDEO_SERVER_URL: 'https://vncent368odd.com/play/', 
    SECOND_VIDEO_SERVER_URL: 'https://heily367ltt.com/play/'
  },

  images: {
    domains: ['res.cloudinary.com', 'm.media-amazon.com', 'media.themoviedb.org'],
    unoptimized: true,
  },
}

module.exports = nextConfig;
