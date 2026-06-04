"use server";

import { verifyStaffCredentials } from "@/lib/auth/credentials";
import { setStaffSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const session = await verifyStaffCredentials(username, password);

  if (!session) {
    return { error: "Invalid username or password." };
  }

  await setStaffSession(session);

  const from = String(formData.get("from") ?? "");
  if (from.startsWith("/staff") && from !== "/staff/login") {
    redirect(from);
  }

  redirect("/staff/homes");
}
