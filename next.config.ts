import type { NextConfig } from "next";
import { phpLegacyRedirects } from "@/lib/redirects/php-legacy";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["r310", "192.168.68.57"],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return phpLegacyRedirects;
  },
};

export default nextConfig;
