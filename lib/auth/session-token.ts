import type { StaffSession } from "@/lib/auth/types";
import {
  SESSION_MAX_AGE_SECONDS,
  STAFF_SESSION_COOKIE,
} from "@/lib/auth/constants";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export { STAFF_SESSION_COOKIE };

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set to a random string of at least 32 characters.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(session: StaffSession): Promise<string> {
  return new SignJWT({
    adminId: session.adminId,
    username: session.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<StaffSession | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const adminId = Number(payload.adminId);
    const username = payload.username;

    if (
      !Number.isInteger(adminId) ||
      adminId <= 0 ||
      typeof username !== "string" ||
      username.length === 0
    ) {
      return null;
    }

    return { adminId, username };
  } catch {
    return null;
  }
}

export async function getStaffSessionFromRequest(
  request: NextRequest,
): Promise<StaffSession | null> {
  const token = request.cookies.get(STAFF_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export function staffSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
