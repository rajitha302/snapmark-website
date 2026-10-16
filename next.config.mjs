import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // A stray lockfile higher up the tree made Next pick the wrong workspace root.
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
