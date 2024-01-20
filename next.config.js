/** @type {import('next').NextConfig} */

module.exports = {
    env: {
          //BACKEND_SERVER_URL: 'http://localhost:4000',
         BACKEND_SERVER_URL: 'https://moviesbazaar-api.vercel.app',
      },

      images: {
            domains: ['res.cloudinary.com', 'm.media-amazon.com'],
            unoptimized: true,
          },
}