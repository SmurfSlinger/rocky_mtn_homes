import "server-only";

import type { HomeFormValues } from "@/lib/types/home-form";
import type { HomeRow } from "@/lib/db/rows";

export function parseHomeFormData(formData: FormData): HomeFormValues {
  return {
    title: String(formData.get("title") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    squareFootage: String(formData.get("square_footage") ?? "").trim(),
    lengthFt: String(formData.get("length_ft") ?? "").trim(),
    widthFt: String(formData.get("width_ft") ?? "").trim(),
    heightFt: String(formData.get("height_ft") ?? "").trim(),
    bedrooms: String(formData.get("bedrooms") ?? "").trim(),
    bathrooms: String(formData.get("bathrooms") ?? "").trim(),
    hasWasherDryerHookups: formData.get("has_washer_dryer_hookups") === "on",
    hasAc: formData.get("has_ac") === "on",
    hasFurnace: formData.get("has_furnace") === "on",
    includesAppliances: formData.get("includes_appliances") === "on",
    flooringType: String(formData.get("flooring_type") ?? "").trim(),
    yearBuilt: String(formData.get("year_built") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    extras: String(formData.get("extras") ?? "").trim(),
    status: String(formData.get("status") ?? "").trim(),
  };
}

export function mapHomeRowToFormValues(row: HomeRow): HomeFormValues {
  return {
    title: row.title ?? "",
    price: row.price ?? "",
    squareFootage: String(row.square_footage ?? ""),
    lengthFt: row.length_ft ?? "",
    widthFt: row.width_ft ?? "",
    heightFt: row.height_ft ?? "",
    bedrooms: row.bedrooms != null ? String(row.bedrooms) : "",
    bathrooms: row.bathrooms != null ? String(row.bathrooms) : "",
    hasWasherDryerHookups: row.has_washer_dryer_hookups === 1,
    hasAc: row.has_ac === 1,
    hasFurnace: row.has_furnace === 1,
    includesAppliances: row.includes_appliances === 1,
    flooringType: row.flooring_type ?? "",
    yearBuilt: row.year_built != null ? String(row.year_built) : "",
    description: row.description ?? "",
    extras: row.extras ?? "",
    status: row.status ?? "",
  };
}

export function getImageFileFromFormData(
  formData: FormData,
): File | null {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }
  return file;
}
