/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.tradingview.com" },
    ],
  },
};

export default nextConfig;
