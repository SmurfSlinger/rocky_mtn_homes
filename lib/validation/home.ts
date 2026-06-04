import type { HomeFormValues } from "@/lib/types/home-form";

type ValidateOptions = {
  requireImage?: boolean;
  hasImageFile?: boolean;
};

export function validateHomeForm(
  values: HomeFormValues,
  options: ValidateOptions = {},
): string[] {
  const errors: string[] = [];

  if (!values.title.trim()) {
    errors.push("Title cannot be blank.");
  }

  if (values.price.trim() !== "" && Number.isNaN(Number(values.price))) {
    errors.push("Price must be a valid number.");
  }

  if (values.price.trim() !== "" && Number(values.price) < 0) {
    errors.push("Price cannot be negative.");
  }

  const sqFt = Number(values.squareFootage);
  if (values.squareFootage.trim() === "" || Number.isNaN(sqFt)) {
    errors.push("Square footage must be a number.");
  } else if (sqFt < 0) {
    errors.push("Square footage must be a non-negative number.");
  }

  const length = Number(values.lengthFt);
  if (values.lengthFt.trim() === "" || Number.isNaN(length) || length <= 0) {
    errors.push("Length must be a positive number.");
  }

  const width = Number(values.widthFt);
  if (values.widthFt.trim() === "" || Number.isNaN(width) || width <= 0) {
    errors.push("Width must be a positive number.");
  }

  if (values.heightFt.trim() !== "") {
    const height = Number(values.heightFt);
    if (Number.isNaN(height) || height <= 0) {
      errors.push("Height must be a positive number when provided.");
    }
  }

  if (values.bedrooms.trim() !== "" && Number.isNaN(Number(values.bedrooms))) {
    errors.push("Bedrooms must be a valid number.");
  }

  if (values.bathrooms.trim() !== "" && Number.isNaN(Number(values.bathrooms))) {
    errors.push("Bathrooms must be a valid number.");
  }

  if (values.yearBuilt.trim() !== "") {
    const year = Number(values.yearBuilt);
    const currentYear = new Date().getFullYear();
    if (Number.isNaN(year) || year < 1800 || year > currentYear) {
      errors.push(`Year built must be between 1800 and ${currentYear}.`);
    }
  }

  if (!values.status) {
    errors.push("Status is required.");
  } else if (!["available", "sold"].includes(values.status)) {
    errors.push("Status must be available or sold.");
  }

  if (options.requireImage && !options.hasImageFile) {
    errors.push("Cover image is required.");
  }

  return errors;
}
