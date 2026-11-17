import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Matikan seluruh badge dan popup dev indicator di layar */
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
