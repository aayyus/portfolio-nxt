/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Project covers added via the admin panel can be external URLs
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
