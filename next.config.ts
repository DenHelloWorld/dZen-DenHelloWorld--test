import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Minimal self-contained server bundle (.next/standalone) for the prod Docker image.
  output: 'standalone',
  typescript: {
    // Test files are type-checked separately (npx tsc --noEmit uses tsconfig.json,
    // which includes them); the production build only cares about app code.
    tsconfigPath: './tsconfig.build.json',
  },
};

export default nextConfig;
