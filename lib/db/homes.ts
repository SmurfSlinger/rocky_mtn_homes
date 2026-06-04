import "server-only";

import { getPool } from "@/lib/db/connection";
import {
  buildHomeGalleryPaths,
  mapHomeImageRow,
  mapHomeRow,
  mapHomeToSummary,
} from "@/lib/db/mappers";
import type { HomeImageRow, HomeRow } from "@/lib/db/rows";
import type { Home, HomeImage, HomeSummary } from "@/lib/types/database";

const HOME_SELECT = `
  SELECT
    id,
    title,
    description,
    price,
    image_path,
    extras,
    status,
    square_footage,
    bedrooms,
    bathrooms,
    has_washer_dryer_hookups,
    has_ac,
    has_furnace,
    includes_appliances,
    flooring_type,
    year_built,
    length_ft,
    width_ft,
    height_ft
  FROM homes
`;

export async function getAllHomes(): Promise<Home[]> {
  const pool = getPool();
  const [rows] = await pool.query<HomeRow[]>(
    `${HOME_SELECT} ORDER BY id DESC`,
  );
  return rows.map(mapHomeRow);
}

export async function getHomeById(id: number): Promise<Home | null> {
  const pool = getPool();
  const [rows] = await pool.query<HomeRow[]>(
    `${HOME_SELECT} WHERE id = ? LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? mapHomeRow(row) : null;
}

export async function getHomeImagesByHomeId(
  homeId: number,
): Promise<HomeImage[]> {
  const pool = getPool();
  const [rows] = await pool.query<HomeImageRow[]>(
    `SELECT id, home_id, image_path
     FROM home_images
     WHERE home_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [homeId],
  );
  return rows.map(mapHomeImageRow);
}

/**
 * Public inventory listing — currently returns every home, matching PHP
 * `Home::find_all()` (no status filter).
 */
export async function getHomesForPublicInventory(): Promise<HomeSummary[]> {
  const homes = await getAllHomes();
  return homes.map(mapHomeToSummary);
}

/**
 * Future-friendly filter: only homes with `status = 'available'`.
 * Switch the inventory page to this when you want to hide sold listings.
 */
export async function getAvailableHomesForPublicInventory(): Promise<
  HomeSummary[]
> {
  const pool = getPool();
  const [rows] = await pool.query<HomeRow[]>(
    `${HOME_SELECT} WHERE status = ? ORDER BY id DESC`,
    ["available"],
  );
  return rows.map((row) => mapHomeToSummary(mapHomeRow(row)));
}

export async function getHomeGalleryForDetail(
  homeId: number,
): Promise<{ home: Home; galleryPaths: string[] } | null> {
  const home = await getHomeById(homeId);
  if (!home) {
    return null;
  }
  const images = await getHomeImagesByHomeId(homeId);
  const galleryPaths = buildHomeGalleryPaths(home, images);
  return { home, galleryPaths };
}
