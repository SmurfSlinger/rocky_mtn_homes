import "server-only";

import mysql from "mysql2/promise";

const globalForPool = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

/** Strip CRLF from env values (Windows-style .env.local breaks MySQL host lookup). */
function envValue(value: string | undefined, fallback = ""): string {
  return (value ?? fallback).replace(/\r/g, "").trim();
}

function createPool(): mysql.Pool {
  const databaseUrl = envValue(process.env.DATABASE_URL);
  if (databaseUrl) {
    return mysql.createPool(databaseUrl);
  }

  const host = envValue(process.env.DATABASE_HOST, "127.0.0.1");
  const port = Number(envValue(process.env.DATABASE_PORT, "3306"));
  const user = envValue(process.env.DATABASE_USER);
  const password = envValue(process.env.DATABASE_PASSWORD);
  const database = envValue(process.env.DATABASE_NAME, "rocky_mtn_homes");

  if (!user || password === undefined) {
    throw new Error(
      "Database credentials missing. Set DATABASE_URL or DATABASE_USER and DATABASE_PASSWORD.",
    );
  }

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    enableKeepAlive: true,
  });
}

export function getPool(): mysql.Pool {
  if (!globalForPool.mysqlPool) {
    globalForPool.mysqlPool = createPool();
  }
  return globalForPool.mysqlPool;
}
