import "server-only";

import type { StaffSession } from "@/lib/auth/types";
import { getStaffSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) {
    redirect("/staff/login");
  }
  return session;
}
