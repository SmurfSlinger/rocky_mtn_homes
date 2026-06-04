import "server-only";

import { getPool } from "@/lib/db/connection";
import { mapHomeImageRow } from "@/lib/db/mappers";
import type { HomeImageRow } from "@/lib/db/rows";
import type { HomeImage } from "@/lib/types/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export async function getHomeImageById(
  imageId: number,
): Promise<HomeImage | null> {
  const pool = getPool();
  const [rows] = await pool.query<HomeImageRow[]>(
    `SELECT id, home_id, image_path FROM home_images WHERE id = ? LIMIT 1`,
    [imageId],
  );
  const row = rows[0];
  return row ? mapHomeImageRow(row) : null;
}

export async function getHomeImageForHome(
  imageId: number,
  homeId: number,
): Promise<HomeImage | null> {
  const pool = getPool();
  const [rows] = await pool.query<HomeImageRow[]>(
    `SELECT id, home_id, image_path
     FROM home_images
     WHERE id = ? AND home_id = ?
     LIMIT 1`,
    [imageId, homeId],
  );
  const row = rows[0];
  return row ? mapHomeImageRow(row) : null;
}

export async function createHomeImageRecord(
  homeId: number,
  imagePath: string,
): Promise<number> {
  const pool = getPool();
  const [maxRows] = await pool.query<(RowDataPacket & { max_order: number })[]>(
    `SELECT COALESCE(MAX(sort_order), -1) AS max_order
     FROM home_images WHERE home_id = ?`,
    [homeId],
  );
  const nextOrder = Number(maxRows[0]?.max_order ?? -1) + 1;

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO home_images (home_id, image_path, sort_order) VALUES (?, ?, ?)`,
    [homeId, imagePath, nextOrder],
  );
  return result.insertId;
}

export async function reorderHomeGalleryImages(
  homeId: number,
  orderedImageIds: number[],
): Promise<boolean> {
  const pool = getPool();
  const [rows] = await pool.query<(RowDataPacket & { id: number })[]>(
    `SELECT id FROM home_images WHERE home_id = ? ORDER BY sort_order ASC, id ASC`,
    [homeId],
  );

  const existingIds = rows.map((r) => r.id);
  if (existingIds.length !== orderedImageIds.length) {
    return false;
  }

  const existingSet = new Set(existingIds);
  if (!orderedImageIds.every((id) => existingSet.has(id))) {
    return false;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (let i = 0; i < orderedImageIds.length; i++) {
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE home_images SET sort_order = ?
         WHERE id = ? AND home_id = ? LIMIT 1`,
        [i, orderedImageIds[i], homeId],
      );
      if (result.affectedRows !== 1) {
        await connection.rollback();
        return false;
      }
    }
    await connection.commit();
    return true;
  } catch {
    await connection.rollback();
    return false;
  } finally {
    connection.release();
  }
}

export async function updateHomeImageRecordPath(
  imageId: number,
  homeId: number,
  imagePath: string,
): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE home_images SET image_path = ? WHERE id = ? AND home_id = ? LIMIT 1`,
    [imagePath, imageId, homeId],
  );
  return result.affectedRows === 1;
}

export async function deleteHomeImageRecord(
  imageId: number,
  homeId: number,
): Promise<HomeImage | null> {
  const image = await getHomeImageForHome(imageId, homeId);
  if (!image) {
    return null;
  }

  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM home_images WHERE id = ? AND home_id = ? LIMIT 1`,
    [imageId, homeId],
  );

  return result.affectedRows === 1 ? image : null;
}

/** Paths referenced by gallery rows for a home (relative, as stored in DB). */
export async function getGalleryImagePathsForHome(
  homeId: number,
): Promise<string[]> {
  const pool = getPool();
  const [rows] = await pool.query<
    (RowDataPacket & { image_path: string | null })[]
  >(
    `SELECT image_path FROM home_images
     WHERE home_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [homeId],
  );
  return rows
    .map((r) => r.image_path?.trim())
    .filter((p): p is string => Boolean(p));
}

/**
 * True if path is still used as this home's cover or another gallery row.
 */
export async function isImagePathReferencedByHome(
  homeId: number,
  imagePath: string,
  options?: { excludeGalleryImageId?: number },
): Promise<boolean> {
  const pool = getPool();
  const normalized = imagePath.trim();

  const [coverRows] = await pool.query<
    (RowDataPacket & { image_path: string | null })[]
  >(`SELECT image_path FROM homes WHERE id = ? LIMIT 1`, [homeId]);
  if (coverRows[0]?.image_path?.trim() === normalized) {
    return true;
  }

  const excludeId = options?.excludeGalleryImageId;
  const [galleryRows] = excludeId
    ? await pool.query<(RowDataPacket & { count: number })[]>(
        `SELECT COUNT(*) AS count FROM home_images
         WHERE home_id = ? AND image_path = ? AND id <> ?`,
        [homeId, normalized, excludeId],
      )
    : await pool.query<(RowDataPacket & { count: number })[]>(
        `SELECT COUNT(*) AS count FROM home_images
         WHERE home_id = ? AND image_path = ?`,
        [homeId, normalized],
      );

  const count = Number(galleryRows[0]?.count ?? 0);
  return count > 0;
}

export async function collectImagePathsForHome(
  homeId: number,
): Promise<string[]> {
  const pool = getPool();
  const paths = new Set<string>();

  const [homeRows] = await pool.query<
    (RowDataPacket & { image_path: string | null })[]
  >(`SELECT image_path FROM homes WHERE id = ?`, [homeId]);
  const cover = homeRows[0]?.image_path?.trim();
  if (cover) {
    paths.add(cover);
  }

  for (const p of await getGalleryImagePathsForHome(homeId)) {
    paths.add(p);
  }

  return [...paths];
}
