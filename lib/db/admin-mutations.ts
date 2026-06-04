import "server-only";

import { getPool } from "@/lib/db/connection";
import type { AdminPublic } from "@/lib/types/admin-public";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

const ADMIN_PUBLIC_SELECT = `
  SELECT id, first_name, last_name, email, username
  FROM admins
`;

type AdminPublicRow = RowDataPacket & {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
};

function mapAdminPublicRow(row: AdminPublicRow): AdminPublic {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    username: row.username,
  };
}

export async function getAllAdminsPublic(): Promise<AdminPublic[]> {
  const pool = getPool();
  const [rows] = await pool.query<AdminPublicRow[]>(
    `${ADMIN_PUBLIC_SELECT} ORDER BY id ASC`,
  );
  return rows.map(mapAdminPublicRow);
}

export async function getAdminPublicById(
  id: number,
): Promise<AdminPublic | null> {
  const pool = getPool();
  const [rows] = await pool.query<AdminPublicRow[]>(
    `${ADMIN_PUBLIC_SELECT} WHERE id = ? LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? mapAdminPublicRow(row) : null;
}

export async function isUsernameTaken(
  username: string,
  excludeAdminId?: number,
): Promise<boolean> {
  const pool = getPool();
  const trimmed = username.trim();

  const [rows] =
    excludeAdminId != null
      ? await pool.query<(RowDataPacket & { count: number })[]>(
          `SELECT COUNT(*) AS count FROM admins WHERE username = ? AND id <> ?`,
          [trimmed, excludeAdminId],
        )
      : await pool.query<(RowDataPacket & { count: number })[]>(
          `SELECT COUNT(*) AS count FROM admins WHERE username = ?`,
          [trimmed],
        );

  return Number(rows[0]?.count ?? 0) > 0;
}

/** Bcrypt cost 10 matches PHP PASSWORD_BCRYPT default. */
export async function hashAdminPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export type AdminWritePayload = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  hashedPassword?: string;
};

export async function createAdminRecord(
  payload: AdminWritePayload,
): Promise<number> {
  if (!payload.hashedPassword) {
    throw new Error("hashedPassword is required when creating an admin.");
  }

  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO admins (first_name, last_name, email, username, hashed_password)
     VALUES (?, ?, ?, ?, ?)`,
    [
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.username,
      payload.hashedPassword,
    ],
  );
  return result.insertId;
}

export async function updateAdminRecord(
  id: number,
  payload: AdminWritePayload,
): Promise<boolean> {
  const pool = getPool();

  if (payload.hashedPassword) {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE admins SET
        first_name = ?,
        last_name = ?,
        email = ?,
        username = ?,
        hashed_password = ?
      WHERE id = ?
      LIMIT 1`,
      [
        payload.firstName,
        payload.lastName,
        payload.email,
        payload.username,
        payload.hashedPassword,
        id,
      ],
    );
    return result.affectedRows === 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE admins SET
      first_name = ?,
      last_name = ?,
      email = ?,
      username = ?
    WHERE id = ?
    LIMIT 1`,
    [payload.firstName, payload.lastName, payload.email, payload.username, id],
  );
  return result.affectedRows === 1;
}

export async function deleteAdminRecord(id: number): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM admins WHERE id = ? LIMIT 1`,
    [id],
  );
  return result.affectedRows === 1;
}

export async function countAdmins(): Promise<number> {
  const pool = getPool();
  const [rows] = await pool.query<(RowDataPacket & { count: number })[]>(
    `SELECT COUNT(*) AS count FROM admins`,
  );
  return Number(rows[0]?.count ?? 0);
}
