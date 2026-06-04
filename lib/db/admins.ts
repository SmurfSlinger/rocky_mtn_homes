import "server-only";

import { getPool } from "@/lib/db/connection";
import { mapAdminRow } from "@/lib/db/mappers";
import type { AdminRow } from "@/lib/db/rows";
import type { Admin } from "@/lib/types/database";

const ADMIN_SELECT = `
  SELECT id, username, hashed_password, first_name, last_name, email
  FROM admins
`;

/** Loaded for future staff auth — not used on public pages yet. */
export async function getAdminById(id: number): Promise<Admin | null> {
  const pool = getPool();
  const [rows] = await pool.query<AdminRow[]>(
    `${ADMIN_SELECT} WHERE id = ? LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? mapAdminRow(row) : null;
}

export async function getAdminByUsername(
  username: string,
): Promise<Admin | null> {
  const pool = getPool();
  const [rows] = await pool.query<AdminRow[]>(
    `${ADMIN_SELECT} WHERE username = ? LIMIT 1`,
    [username],
  );
  const row = rows[0];
  return row ? mapAdminRow(row) : null;
}
