"use server";

import { clearStaffSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await clearStaffSession();
  redirect("/staff/login");
}
