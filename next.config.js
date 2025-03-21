/** @type {import('next').NextConfig} */

const nextConfig = {
 
  // this env set for client side access
  env: {
    APP_VERSION: '6.4.0',
    APP_DOMAIN: 'https://www.moviesbazar.net',
    BACKEND_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://moviesbazarapi.vercel.app',
    VIDEO_SERVER_URL: 'https://snowant327arh.com/play/',
    SECOND_VIDEO_SERVER_URL: 'https://jillw337rpo.com/play/'
  },

  images: {
    domains: ['res.cloudinary.com', 'm.media-amazon.com', 'media.themoviedb.org'],
    unoptimized: true,
  },
}

module.exports = nextConfig;
