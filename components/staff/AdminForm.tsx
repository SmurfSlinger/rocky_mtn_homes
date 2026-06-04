"use client";

import type { AdminFormState, AdminFormValues } from "@/lib/types/admin-form";
import { emptyAdminFormValues } from "@/lib/types/admin-form";
import { inputClassName, buttonPrimaryClassName } from "@/lib/ui";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

type AdminFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  initialValues?: AdminFormValues;
  adminId?: number;
};

function getPasswordHints(password: string): string[] {
  const hints: string[] = [];
  if (password.length > 0 && password.length < 12) {
    hints.push("At least 12 characters");
  }
  if (password.length > 0 && !/[A-Z]/.test(password)) {
    hints.push("One uppercase letter");
  }
  if (password.length > 0 && !/[a-z]/.test(password)) {
    hints.push("One lowercase letter");
  }
  if (password.length > 0 && !/[0-9]/.test(password)) {
    hints.push("One number");
  }
  if (password.length > 0 && !/[^A-Za-z0-9\s]/.test(password)) {
    hints.push("One symbol");
  }
  return hints;
}

export function AdminForm({
  mode,
  action,
  initialValues,
  adminId,
}: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const v = state.values ?? initialValues ?? emptyAdminFormValues;
  const errors = state.errors ?? [];
  const passwordHints = useMemo(() => getPasswordHints(password), [password]);
  const passwordsMatch =
    password.length === 0 ||
    confirmPassword.length === 0 ||
    password === confirmPassword;

  return (
    <form action={formAction} className="space-y-5">
      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded border border-red-400 bg-red-100 p-4 text-sm text-red-700"
        >
          <ul className="list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <p>
        <Link href="/staff/admins" className="text-[#8B2C2C] hover:underline">
          &laquo; Back to Admin List
        </Link>
      </p>

      <Field label="First Name *">
        <input
          type="text"
          name="first_name"
          required
          defaultValue={v.firstName}
          className={inputClassName}
        />
      </Field>

      <Field label="Last Name *">
        <input
          type="text"
          name="last_name"
          required
          defaultValue={v.lastName}
          className={inputClassName}
        />
      </Field>

      <Field label="Email *">
        <input
          type="email"
          name="email"
          required
          defaultValue={v.email}
          className={inputClassName}
        />
      </Field>

      <Field label="Username *">
        <input
          type="text"
          name="username"
          required
          minLength={8}
          defaultValue={v.username}
          className={inputClassName}
          autoComplete="username"
        />
      </Field>

      <Field
        label={
          mode === "create"
            ? "Password *"
            : "New Password (leave blank to keep current)"
        }
      >
        <input
          type="password"
          name="password"
          required={mode === "create"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClassName}
          autoComplete={mode === "create" ? "new-password" : "off"}
        />
        {password.length > 0 && passwordHints.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-xs text-[#4b3621]">
            {passwordHints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        )}
      </Field>

      <Field
        label={
          mode === "create" ? "Confirm Password *" : "Confirm Password"
        }
      >
        <input
          type="password"
          name="confirm_password"
          required={mode === "create"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClassName}
          autoComplete={mode === "create" ? "new-password" : "off"}
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-1 text-xs text-red-700">Passwords do not match.</p>
        )}
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {mode === "edit" && adminId ? (
          <Link
            href={`/staff/admins/${adminId}/delete`}
            className="text-sm text-red-700 hover:underline"
          >
            Delete this admin
          </Link>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimaryClassName} disabled:opacity-60`}
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create Admin User"
              : "Update Admin"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[#5C4033]">
        {label}
      </label>
      {children}
    </div>
  );
}
