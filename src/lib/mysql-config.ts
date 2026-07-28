import type { PoolConfig } from 'mariadb';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getMysqlPoolConfig(): PoolConfig {
  return {
    host: requireEnv('MYSQL_HOST'),
    port: Number(requireEnv('MYSQL_PORT')),
    user: requireEnv('MYSQL_USER'),
    password: requireEnv('MYSQL_PASSWORD'),
    database: requireEnv('MYSQL_DATABASE'),
    // MySQL 8's caching_sha2_password needs an RSA key exchange on a fresh
    // (unencrypted) connection whenever the server's auth cache is cold, e.g.
    // right after a restart. Without this the driver refuses the exchange
    // and the failure surfaces only as an opaque pool timeout.
    allowPublicKeyRetrieval: true,
    // Hosted MySQL providers (e.g. Aiven) require TLS; rejectUnauthorized is
    // left off so we don't have to ship their CA cert into the image.
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
}
