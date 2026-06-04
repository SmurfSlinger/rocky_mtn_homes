import "server-only";

import type { StaffSession } from "@/lib/auth/types";
import { getAdminByUsername } from "@/lib/db/admins";
import bcrypt from "bcryptjs";

export async function verifyStaffCredentials(
  username: string,
  password: string,
): Promise<StaffSession | null> {
  const trimmedUsername = username.trim();
  if (!trimmedUsername || !password) {
    return null;
  }

  const admin = await getAdminByUsername(trimmedUsername);
  if (!admin) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    admin.hashedPassword,
  );

  if (!passwordMatches) {
    return null;
  }

  return {
    adminId: admin.id,
    username: admin.username,
  };
}
