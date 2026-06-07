/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig = isGhPages
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
        return [
          {
            source: "/api/:path*",
            destination: `${apiUrl}/api/:path*`,
          },
        ];
      },
    };

export default nextConfig;
