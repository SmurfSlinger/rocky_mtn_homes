/**
 * Add home_images.sort_order and backfill from current id order.
 *   node scripts/migrate-home-images-sort-order.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

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

  const [columns] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'home_images'
       AND COLUMN_NAME = 'sort_order'`,
  );

  if (columns.length === 0) {
    await connection.execute(
      `ALTER TABLE home_images
       ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER image_path`,
    );
    console.log("Added home_images.sort_order");
  } else {
    console.log("home_images.sort_order already exists");
  }

  const [homes] = await connection.query(
    "SELECT DISTINCT home_id FROM home_images WHERE home_id IS NOT NULL",
  );

  for (const { home_id: homeId } of homes) {
    const [rows] = await connection.query(
      "SELECT id FROM home_images WHERE home_id = ? ORDER BY id ASC",
      [homeId],
    );
    for (let i = 0; i < rows.length; i++) {
      await connection.execute(
        "UPDATE home_images SET sort_order = ? WHERE id = ? AND home_id = ?",
        [i, rows[i].id, homeId],
      );
    }
    console.log(`Backfilled home_id=${homeId} (${rows.length} images)`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
