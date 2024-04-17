/** @type {import('next').NextConfig} */

module.exports = {
    env: {
          BACKEND_SERVER_URL: process.env.NODE_ENV === 'development' ?  'http://localhost:4000' : 'https://moviesbazaar-api.vercel.app',

      },

      images: {
            domains: ['res.cloudinary.com', 'm.media-amazon.com'],
            unoptimized: true,
          },
}