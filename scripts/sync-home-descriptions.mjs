/**
 * Set every home description to beds/baths only (matches app display + save logic).
 *   node scripts/sync-home-descriptions.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function formatBedsBathsDescription(bedrooms, bathrooms) {
  const parts = [];
  if (bedrooms != null) parts.push(`${bedrooms} bed`);
  if (bathrooms != null) parts.push(`${bathrooms} bath`);
  return parts.length === 0 ? "" : `${parts.join(", ")}.`;
}

function loadEnvLocal() {
  const raw = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.replace(/\r$/, "").trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value.replace(/\r$/, "");
  }
  return env;
}

async function main() {
  const env = loadEnvLocal();
  const connection = await mysql.createConnection({
    host: (env.DATABASE_HOST || "127.0.0.1").trim(),
    port: Number((env.DATABASE_PORT || "3306").trim()),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: (env.DATABASE_NAME || "rocky_mtn_homes").trim(),
  });

  const [rows] = await connection.query(
    "SELECT id, title, bedrooms, bathrooms, description FROM homes ORDER BY id",
  );

  for (const row of rows) {
    const next = formatBedsBathsDescription(row.bedrooms, row.bathrooms);
    await connection.execute("UPDATE homes SET description = ? WHERE id = ?", [
      next,
      row.id,
    ]);
    console.log(`${row.id} ${row.title}: "${next}"`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
