import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';
import { getMysqlPoolConfig } from '@/lib/mysql-config';

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb(getMysqlPoolConfig());

export const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
