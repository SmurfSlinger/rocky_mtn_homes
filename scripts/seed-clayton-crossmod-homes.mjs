/**
 * Seed / refresh Clayton CrossMod listings + locally stored gallery images.
 *
 * Usage (from project root):
 *   node scripts/seed-clayton-crossmod-homes.mjs
 *   node scripts/seed-clayton-crossmod-homes.mjs --refresh-images
 *
 * --refresh-images  Re-download all photos for existing Clayton titles (by title match).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const UPLOAD_DIR = path.join(ROOT, "public", "images", "homes");
const FALLBACK_COVER = "css/images/example_home.jpg";

const REFRESH_IMAGES = process.argv.includes("--refresh-images");

const USER_AGENT =
  "RockyMountainHomesSeed/1.0 (+https://rockymountainhomesales.com)";

function formatBedsBathsDescription(bedrooms, bathrooms) {
  const parts = [];
  if (bedrooms != null) parts.push(`${bedrooms} bed`);
  if (bathrooms != null) parts.push(`${bathrooms} bath`);
  return parts.length === 0 ? "" : `${parts.join(", ")}.`;
}

const HOMES = [
  {
    title: "Keeneland",
    slug: "keeneland",
    sourceUrl: "https://www.claytonbuilt.com/crossmod/keeneland",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1740,
    lengthFt: "30",
    widthFt: "58",
    extras:
      "Clayton CrossMod model. Covered Porch, Dining Room, Double Sinks in Bath, Drywall, Garage, Kitchen Island, Open Floor Plan, Utility Room.",
  },
  {
    title: "Belmont",
    slug: "belmont",
    sourceUrl: "https://www.claytonbuilt.com/crossmod/belmont",
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1800,
    lengthFt: "30",
    widthFt: "60",
    extras: "Clayton CrossMod model.",
  },
  {
    title: "Hawthorne",
    slug: "hawthorne",
    sourceUrl: "https://www.claytonbuilt.com/crossmod/hawthorne",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1740,
    lengthFt: "30",
    widthFt: "58",
    extras:
      "Clayton CrossMod model. Covered Porch, Dining Room, Double Sinks in Bath, Drywall, Foyer, Garage, Kitchen Island, Utility Room.",
  },
  {
    title: "Aspen",
    slug: "aspen",
    sourceUrl: "https://www.claytonbuilt.com/crossmod/aspen",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1620,
    lengthFt: "32",
    widthFt: "60",
    extras:
      "Clayton CrossMod model. Garage, flex space, utility room (per manufacturer floor plan imagery).",
  },
  {
    title: "Magnolia",
    slug: "magnolia",
    sourceUrl: "https://www.claytonbuilt.com/crossmod/magnolia",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1635,
    lengthFt: "32",
    widthFt: "58",
    extras: "Clayton CrossMod model. Garage (per manufacturer rendering).",
  },
];

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing .env.local — copy from .env.example");
  }
  const raw = fs.readFileSync(envPath, "utf8");
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

async function fetchPageHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function extractImageUrls(html) {
  const matches = html.matchAll(
    /https:\/\/images\.ctfassets\.net\/[^"'\\\s]+/g,
  );
  const urls = [...matches].map((m) => m[0].replace(/\\u0026/g, "&"));
  return [...new Set(urls)];
}

function extensionFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const lower = pathname.toLowerCase();
    if (lower.endsWith(".png")) return ".png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
    if (lower.endsWith(".webp")) return ".webp";
  } catch {
    /* ignore */
  }
  if (url.includes("fm=webp")) return ".webp";
  return ".jpg";
}

/** Floor plans / 2D diagrams sort last; photos first for cover + gallery. */
function isFloorPlanUrl(url) {
  const l = url.toLowerCase();
  if (l.includes("-2d") || l.includes("_2d")) return true;
  if (/[/_.-]2d\.(png|jpe?g|webp)/.test(l)) return true;
  if (
    l.includes("floor-plan") ||
    l.includes("floor_plan") ||
    l.includes("floorplan")
  ) {
    return true;
  }
  if (l.includes("floor") && (l.includes("plan") || l.includes("layout"))) {
    return true;
  }
  return false;
}

function sortUrlsPhotosFirst(urls) {
  return [...urls].sort((a, b) => {
    const score = (url) => {
      if (isFloorPlanUrl(url)) return 1000;
      const l = url.toLowerCase();
      if (l.includes("exterior") || l.includes("rendering")) return 0;
      if (l.includes("rear") || l.includes("front") || l.includes("deck")) {
        return 1;
      }
      if (
        l.includes("kitchen") ||
        l.includes("living") ||
        l.includes("bedroom") ||
        l.includes("bath") ||
        l.includes("dining") ||
        l.includes("hall") ||
        l.includes("foyer") ||
        l.includes("utility") ||
        l.includes("flex")
      ) {
        return 5;
      }
      if (l.includes("garage")) return 8;
      return 10;
    };
    return score(a) - score(b);
  });
}

async function downloadImage(url, destFile) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "image/*" },
    redirect: "follow",
  });
  if (!res.ok) {
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) {
    return false;
  }
  await fs.promises.mkdir(path.dirname(destFile), { recursive: true });
  await fs.promises.writeFile(destFile, buf);
  return true;
}

async function removeSlugImageFiles(slug) {
  const prefix = `clayton-crossmod-${slug}-`;
  let entries;
  try {
    entries = await fs.promises.readdir(UPLOAD_DIR);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name.startsWith(prefix)) {
      await fs.promises.unlink(path.join(UPLOAD_DIR, name));
    }
  }
}

async function fetchAndSaveImages(home) {
  const html = await fetchPageHtml(home.sourceUrl);
  const urls = sortUrlsPhotosFirst(extractImageUrls(html));
  await removeSlugImageFiles(home.slug);
  const saved = [];

  for (let i = 0; i < urls.length; i++) {
    const ext = extensionFromUrl(urls[i]);
    const filename = `clayton-crossmod-${home.slug}-${String(i + 1).padStart(2, "0")}${ext}`;
    const relativePath = `images/homes/${filename}`;
    const absolutePath = path.join(ROOT, "public", relativePath);
    const ok = await downloadImage(urls[i], absolutePath);
    if (ok) {
      saved.push(relativePath);
    }
  }

  return { saved, sourceCount: urls.length };
}

async function applyImagesToHome(connection, homeId, imagePaths) {
  const coverPath =
    imagePaths[0] ??
    (fs.existsSync(path.join(ROOT, "public", FALLBACK_COVER))
      ? FALLBACK_COVER
      : "");

  await connection.execute(`DELETE FROM home_images WHERE home_id = ?`, [
    homeId,
  ]);

  await connection.execute(`UPDATE homes SET image_path = ? WHERE id = ?`, [
    coverPath,
    homeId,
  ]);

  const galleryPaths = imagePaths.slice(1);
  for (let i = 0; i < galleryPaths.length; i++) {
    await connection.execute(
      `INSERT INTO home_images (home_id, image_path, sort_order) VALUES (?, ?, ?)`,
      [homeId, galleryPaths[i], i],
    );
  }

  return coverPath;
}

async function syncHomeSpecs(connection, home, homeId) {
  const description = formatBedsBathsDescription(home.bedrooms, home.bathrooms);
  await connection.execute(
    `UPDATE homes SET
      square_footage = ?, bedrooms = ?, bathrooms = ?,
      length_ft = ?, width_ft = ?, description = ?
     WHERE id = ?`,
    [
      home.squareFootage,
      home.bedrooms,
      home.bathrooms,
      home.lengthFt,
      home.widthFt,
      description,
      homeId,
    ],
  );
  return description;
}

async function refreshHomeImages(connection, home, homeId) {
  console.log(`Refreshing images: ${home.title} (id=${homeId})…`);
  const { saved, sourceCount } = await fetchAndSaveImages(home);
  const coverPath = await applyImagesToHome(connection, homeId, saved);
  return {
    id: homeId,
    title: home.title,
    coverPath: coverPath || "(placeholder)",
    galleryCount: Math.max(0, saved.length - 1),
    totalImagesDownloaded: saved.length,
    sourceUrlsFound: sourceCount,
    floorPlanLast: saved.length > 0 && isFloorPlanUrl(saved[saved.length - 1]),
  };
}

async function main() {
  const env = loadEnvLocal();
  const host = (env.DATABASE_HOST || "127.0.0.1").trim();
  const port = Number((env.DATABASE_PORT || "3306").trim());
  const user = env.DATABASE_USER;
  const password = env.DATABASE_PASSWORD;
  const database = (env.DATABASE_NAME || "rocky_mtn_homes").trim();

  if (!user || password === undefined) {
    throw new Error("DATABASE_USER and DATABASE_PASSWORD required in .env.local");
  }

  await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
  });

  const report = {
    refreshed: [],
    inserted: [],
    skipped: [],
  };

  try {
    for (const home of HOMES) {
      const [existing] = await connection.query(
        "SELECT id, title FROM homes WHERE title = ? LIMIT 1",
        [home.title],
      );

      if (existing.length > 0) {
        const homeId = existing[0].id;
        const description = await syncHomeSpecs(connection, home, homeId);
        console.log(
          `SYNC specs: ${home.title} id=${homeId} — ${home.squareFootage} sq ft, ${home.lengthFt}' x ${home.widthFt}', ${description}`,
        );
        if (REFRESH_IMAGES) {
          const result = await refreshHomeImages(connection, home, homeId);
          report.refreshed.push(result);
          console.log(
            `REFRESH: ${home.title} id=${homeId} images=${result.totalImagesDownloaded}/${result.sourceUrlsFound} cover=${result.coverPath}`,
          );
        } else {
          report.skipped.push({
            title: home.title,
            reason: "duplicate (specs synced; use --refresh-images to re-download photos)",
            existingId: homeId,
          });
        }
        continue;
      }

      console.log(`Fetching images: ${home.title}…`);
      let saved = [];
      let sourceCount = 0;
      try {
        const result = await fetchAndSaveImages(home);
        saved = result.saved;
        sourceCount = result.sourceCount;
      } catch (err) {
        console.warn(`  Image fetch failed for ${home.title}: ${err.message}`);
      }

      const [insertResult] = await connection.execute(
        `INSERT INTO homes (
          title, description, price, image_path, extras, status,
          square_footage, bedrooms, bathrooms,
          has_washer_dryer_hookups, has_ac, has_furnace, includes_appliances,
          flooring_type, year_built, length_ft, width_ft, height_ft
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, NULL, NULL, ?, ?, ?)`,
        [
          home.title,
          formatBedsBathsDescription(home.bedrooms, home.bathrooms),
          null,
          saved[0] ?? FALLBACK_COVER,
          home.extras,
          "available",
          home.squareFootage,
          home.bedrooms,
          home.bathrooms,
          home.lengthFt,
          home.widthFt,
          null,
        ],
      );

      const homeId = insertResult.insertId;
      if (saved.length > 0) {
        await applyImagesToHome(connection, homeId, saved);
      }

      report.inserted.push({
        id: homeId,
        title: home.title,
        totalImagesDownloaded: saved.length,
        sourceUrlsFound: sourceCount,
      });
      console.log(
        `INSERT: ${home.title} id=${homeId} images=${saved.length}/${sourceCount}`,
      );
    }
  } finally {
    await connection.end();
  }

  console.log("\n=== Seed report ===");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
