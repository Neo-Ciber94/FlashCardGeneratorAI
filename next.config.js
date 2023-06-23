/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required to allow google redirect to work in other URL than: http://localhost:3000/
  trailingSlash: true,

  // Environment variables need to be set this way:
  // https://github.com/aws-amplify/amplify-hosting/issues/1987#issuecomment-885217940
  env: {
    TOPIC_TABLE_NAME: process.env.TOPIC_TABLE_NAME,
    FLASHCARD_TABLE_NAME: process.env.FLASHCARD_TABLE_NAME,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
};

module.exports = nextConfig;
