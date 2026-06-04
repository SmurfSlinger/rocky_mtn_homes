import "server-only";

import type { AdminFormValues } from "@/lib/types/admin-form";
import type { AdminPublic } from "@/lib/types/admin-public";

export function parseAdminFormData(formData: FormData): AdminFormValues {
  return {
    firstName: String(formData.get("first_name") ?? "").trim(),
    lastName: String(formData.get("last_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirm_password") ?? ""),
  };
}

export function adminPublicToFormValues(admin: AdminPublic): AdminFormValues {
  return {
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    username: admin.username,
    password: "",
    confirmPassword: "",
  };
}
