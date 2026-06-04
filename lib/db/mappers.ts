import "server-only";

import { formatBedsBathsDescription } from "@/lib/format-beds-baths-description";
import { resolvePublicImagePath } from "@/lib/images";
import { siteAssets } from "@/lib/site-assets";
import type { Admin, Home, HomeImage, HomeSummary } from "@/lib/types/database";
import type { AdminRow, HomeImageRow, HomeRow } from "@/lib/db/rows";

function nullableTinyInt(value: number | null): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value === 1;
}

export function formatPrice(price: string | null): string | null {
  if (price === null || price === "") {
    return null;
  }
  const numeric = Number(price);
  if (Number.isNaN(numeric)) {
    return price;
  }
  return `$${numeric.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function mapHomeRow(row: HomeRow): Home {
  const imagePath = resolvePublicImagePath(row.image_path);

  return {
    id: row.id,
    title: row.title ?? "",
    description: formatBedsBathsDescription(row.bedrooms, row.bathrooms),
    price: formatPrice(row.price),
    squareFootage: row.square_footage,
    lengthFt: row.length_ft,
    widthFt: row.width_ft,
    heightFt: row.height_ft,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    hasWasherDryerHookups: nullableTinyInt(row.has_washer_dryer_hookups),
    hasAc: nullableTinyInt(row.has_ac),
    hasFurnace: nullableTinyInt(row.has_furnace),
    includesAppliances: nullableTinyInt(row.includes_appliances),
    flooringType: row.flooring_type,
    yearBuilt: row.year_built,
    extras: row.extras,
    imagePath,
    status: row.status ?? "",
  };
}

export function mapHomeToSummary(home: Home): HomeSummary {
  return {
    id: home.id,
    title: home.title,
    description: home.description,
    price: home.price,
    squareFootage: home.squareFootage,
    lengthFt: home.lengthFt,
    widthFt: home.widthFt,
    imagePath: home.imagePath,
    status: home.status,
  };
}

export function mapHomeImageRow(row: HomeImageRow): HomeImage {
  return {
    id: row.id,
    homeId: row.home_id,
    imagePath: resolvePublicImagePath(row.image_path),
  };
}

export function mapAdminRow(row: AdminRow): Admin {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    username: row.username,
    hashedPassword: row.hashed_password,
  };
}

/** Cover image first, then gallery rows — matches PHP `details.php`. */
export function buildHomeGalleryPaths(
  home: Home,
  images: HomeImage[],
): string[] {
  const paths = [
    home.imagePath,
    ...images.map((img) => img.imagePath),
  ].filter((p) => p.length > 0);
  const unique = [...new Set(paths)];
  return unique.length > 0 ? unique : [siteAssets.missingListingImage];
}
