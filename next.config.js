/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
  basePath: '/landing',
  assetPrefix: '/landing',
  images: {
    unoptimized: true
  },
  // Ensure trailing slashes work correctly with subpath
  trailingSlash: true
};

export default config;
