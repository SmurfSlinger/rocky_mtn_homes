import type { AdminFormValues } from "@/lib/types/admin-form";

type ValidateAdminOptions = {
  requirePassword: boolean;
};

function hasLength(value: string, min: number, max: number): boolean {
  const len = value.length;
  return len >= min && len <= max;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("Password must contain 12 or more characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least 1 number.");
  }
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    errors.push("Password must contain at least 1 symbol.");
  }

  return errors;
}

export function validateAdminForm(
  values: AdminFormValues,
  options: ValidateAdminOptions,
): string[] {
  const errors: string[] = [];

  if (!values.firstName.trim()) {
    errors.push("First name cannot be blank.");
  } else if (!hasLength(values.firstName.trim(), 2, 255)) {
    errors.push("First name must be between 2 and 255 characters.");
  }

  if (!values.lastName.trim()) {
    errors.push("Last name cannot be blank.");
  } else if (!hasLength(values.lastName.trim(), 2, 255)) {
    errors.push("Last name must be between 2 and 255 characters.");
  }

  if (!values.email.trim()) {
    errors.push("Email cannot be blank.");
  } else if (values.email.length > 255) {
    errors.push("Email must be less than 255 characters.");
  } else if (!isValidEmail(values.email.trim())) {
    errors.push("Email must be a valid format.");
  }

  if (!values.username.trim()) {
    errors.push("Username cannot be blank.");
  } else if (!hasLength(values.username.trim(), 8, 255)) {
    errors.push("Username must be between 8 and 255 characters.");
  }

  const passwordEntered = values.password.length > 0;
  const confirmEntered = values.confirmPassword.length > 0;

  if (options.requirePassword || passwordEntered || confirmEntered) {
    if (!passwordEntered) {
      errors.push("Password cannot be blank.");
    } else {
      errors.push(...validatePassword(values.password));
    }

    if (!confirmEntered) {
      errors.push("Confirm password cannot be blank.");
    } else if (
      passwordEntered &&
      values.password !== values.confirmPassword
    ) {
      errors.push("Password and confirm password must match.");
    }
  }

  return errors;
}
