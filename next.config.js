/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required to allow google redirect to work in other URL than: http://localhost:3000/
  trailingSlash: true,
};

module.exports = nextConfig;
