import 'dotenv/config';
import { defineConfig } from 'prisma/config';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
