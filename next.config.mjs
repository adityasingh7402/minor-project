/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Increase to handle larger payloads
    },
  },
};

export default nextConfig;
