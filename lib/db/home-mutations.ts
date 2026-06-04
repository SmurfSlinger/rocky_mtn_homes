import "server-only";

import { getPool } from "@/lib/db/connection";
import { collectImagePathsForHome } from "@/lib/db/home-image-mutations";
import { deleteImageFileSafe } from "@/lib/uploads/delete-image-file";
import type { HomeDbPayload } from "@/lib/db/home-payload";
import { mapHomeRowToFormValues } from "@/lib/staff/parse-home-form";
import type { HomeFormValues } from "@/lib/types/home-form";
import type { HomeRow } from "@/lib/db/rows";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

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

function payloadToParams(payload: HomeDbPayload) {
  return [
    payload.title,
    payload.description,
    payload.price,
    payload.imagePath,
    payload.extras,
    payload.status,
    payload.squareFootage,
    payload.bedrooms,
    payload.bathrooms,
    payload.hasWasherDryerHookups,
    payload.hasAc,
    payload.hasFurnace,
    payload.includesAppliances,
    payload.flooringType,
    payload.yearBuilt,
    payload.lengthFt,
    payload.widthFt,
    payload.heightFt,
  ];
}

export async function getHomeImagePathFromDb(id: number): Promise<string> {
  const pool = getPool();
  const [rows] = await pool.query<
    (RowDataPacket & { image_path: string | null })[]
  >(`SELECT image_path FROM homes WHERE id = ? LIMIT 1`, [id]);
  return rows[0]?.image_path?.trim() ?? "";
}

export async function getHomeFormValuesById(
  id: number,
): Promise<HomeFormValues | null> {
  const pool = getPool();
  const [rows] = await pool.query<HomeRow[]>(
    `${HOME_SELECT} WHERE id = ? LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? mapHomeRowToFormValues(row) : null;
}

export async function createHomeRecord(
  payload: HomeDbPayload,
): Promise<number> {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO homes (
      title, description, price, image_path, extras, status,
      square_footage, bedrooms, bathrooms,
      has_washer_dryer_hookups, has_ac, has_furnace, includes_appliances,
      flooring_type, year_built, length_ft, width_ft, height_ft
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    payloadToParams(payload),
  );
  return result.insertId;
}

export async function updateHomeRecord(
  id: number,
  payload: HomeDbPayload,
): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE homes SET
      title = ?,
      description = ?,
      price = ?,
      image_path = ?,
      extras = ?,
      status = ?,
      square_footage = ?,
      bedrooms = ?,
      bathrooms = ?,
      has_washer_dryer_hookups = ?,
      has_ac = ?,
      has_furnace = ?,
      includes_appliances = ?,
      flooring_type = ?,
      year_built = ?,
      length_ft = ?,
      width_ft = ?,
      height_ft = ?
    WHERE id = ?
    LIMIT 1`,
    [...payloadToParams(payload), id],
  );
  return result.affectedRows === 1;
}

export async function deleteHomeRecord(id: number): Promise<boolean> {
  const imagePaths = await collectImagePathsForHome(id);

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM home_images WHERE home_id = ?`,
      [id],
    );

    const [result] = await connection.execute<ResultSetHeader>(
      `DELETE FROM homes WHERE id = ? LIMIT 1`,
      [id],
    );

    await connection.commit();

    if (result.affectedRows === 1) {
      for (const imagePath of imagePaths) {
        await deleteImageFileSafe(imagePath);
      }
    }

    return result.affectedRows === 1;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
