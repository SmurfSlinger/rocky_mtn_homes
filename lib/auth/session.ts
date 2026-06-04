import "server-only";

import type { StaffSession } from "@/lib/auth/types";
import {
  STAFF_SESSION_COOKIE,
  signSessionToken,
  staffSessionCookieOptions,
  verifySessionToken,
} from "@/lib/auth/session-token";
import { cookies } from "next/headers";

export { STAFF_SESSION_COOKIE };

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(STAFF_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function setStaffSession(session: StaffSession): Promise<void> {
  const token = await signSessionToken(session);
  const cookieStore = await cookies();
  cookieStore.set(
    STAFF_SESSION_COOKIE,
    token,
    staffSessionCookieOptions(),
  );
}

export async function clearStaffSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(STAFF_SESSION_COOKIE);
}
