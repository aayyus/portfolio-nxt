/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Project covers added via the admin panel can be external URLs
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Don't let other sites embed this one in a frame (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Don't let browsers guess a file's type from its contents
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
