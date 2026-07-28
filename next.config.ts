import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Test files are type-checked separately (npx tsc --noEmit uses tsconfig.json,
    // which includes them); the production build only cares about app code.
    tsconfigPath: './tsconfig.build.json',
  },
};

export default nextConfig;
