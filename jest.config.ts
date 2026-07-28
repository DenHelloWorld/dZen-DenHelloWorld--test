import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/ws-server/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/generated/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/proxy.ts',
    '!src/lib/{prisma,jwt,mysql-config,products-data,orders-data,warehouses-data,groups-data}.ts',
    '!src/app/api/**',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 80,
      lines: 95,
      statements: 95,
    },
  },
};

export default createJestConfig(config);
