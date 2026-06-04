"use server";

import {
  countAdmins,
  createAdminRecord,
  deleteAdminRecord,
  getAdminPublicById,
  hashAdminPassword,
  isUsernameTaken,
  updateAdminRecord,
} from "@/lib/db/admin-mutations";
import { requireStaffSession } from "@/lib/auth/guards";
import { parseAdminFormData } from "@/lib/staff/parse-admin-form";
import type { AdminFormState } from "@/lib/types/admin-form";
import { validateAdminForm } from "@/lib/validation/admin";
import { redirect } from "next/navigation";

function failure(
  errors: string[],
  values: ReturnType<typeof parseAdminFormData>,
): AdminFormState {
  return { errors, values };
}

export async function createAdminAction(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireStaffSession();

  const values = parseAdminFormData(formData);
  const errors = validateAdminForm(values, { requirePassword: true });

  if (errors.length > 0) {
    return failure(errors, values);
  }

  if (await isUsernameTaken(values.username)) {
    return failure(["Username not allowed, try another."], values);
  }

  const hashedPassword = await hashAdminPassword(values.password);
  await createAdminRecord({
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    username: values.username,
    hashedPassword,
  });

  redirect("/staff/admins");
}

export async function updateAdminAction(
  adminId: number,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireStaffSession();

  const existing = await getAdminPublicById(adminId);
  if (!existing) {
    redirect("/staff/admins");
  }

  const values = parseAdminFormData(formData);
  const passwordEntered = values.password.length > 0;
  const errors = validateAdminForm(values, {
    requirePassword: false,
  });

  if (errors.length > 0) {
    return failure(errors, values);
  }

  if (await isUsernameTaken(values.username, adminId)) {
    return failure(["Username not allowed, try another."], values);
  }

  const payload = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    username: values.username,
    hashedPassword: passwordEntered
      ? await hashAdminPassword(values.password)
      : undefined,
  };

  const updated = await updateAdminRecord(adminId, payload);
  if (!updated) {
    return failure(["Failed to update admin."], values);
  }

  redirect("/staff/admins");
}

export async function deleteAdminAction(adminId: number): Promise<void> {
  const session = await requireStaffSession();

  if (session.adminId === adminId) {
    redirect("/staff/admins?error=self-delete");
  }

  const admin = await getAdminPublicById(adminId);
  if (!admin) {
    redirect("/staff/admins");
  }

  const total = await countAdmins();
  if (total <= 1) {
    redirect("/staff/admins?error=last-admin");
  }

  const deleted = await deleteAdminRecord(adminId);
  if (!deleted) {
    redirect("/staff/admins?error=delete-failed");
  }

  redirect("/staff/admins");
}
