import "server-only";

import { formatBedsBathsDescription } from "@/lib/format-beds-baths-description";
import type { HomeFormValues } from "@/lib/types/home-form";

export type HomeDbPayload = {
  title: string;
  description: string;
  price: number | null;
  imagePath: string;
  extras: string | null;
  status: string;
  squareFootage: number;
  bedrooms: number | null;
  bathrooms: number | null;
  hasWasherDryerHookups: number;
  hasAc: number;
  hasFurnace: number;
  includesAppliances: number;
  flooringType: string | null;
  yearBuilt: number | null;
  lengthFt: string;
  widthFt: string;
  heightFt: string | null;
};

function optionalInt(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }
  const n = Number(value);
  return Number.isNaN(n) ? null : Math.trunc(n);
}

function optionalDecimal(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function homeFormValuesToDbPayload(
  values: HomeFormValues,
  imagePath: string,
): HomeDbPayload {
  const bedrooms = optionalInt(values.bedrooms);
  const bathrooms = optionalInt(values.bathrooms);

  return {
    title: values.title,
    description: formatBedsBathsDescription(bedrooms, bathrooms),
    price: optionalDecimal(values.price),
    imagePath,
    extras: values.extras || null,
    status: values.status,
    squareFootage: Number(values.squareFootage),
    bedrooms: optionalInt(values.bedrooms),
    bathrooms: optionalInt(values.bathrooms),
    hasWasherDryerHookups: values.hasWasherDryerHookups ? 1 : 0,
    hasAc: values.hasAc ? 1 : 0,
    hasFurnace: values.hasFurnace ? 1 : 0,
    includesAppliances: values.includesAppliances ? 1 : 0,
    flooringType: values.flooringType || null,
    yearBuilt: optionalInt(values.yearBuilt),
    lengthFt: values.lengthFt,
    widthFt: values.widthFt,
    heightFt: values.heightFt.trim() === "" ? null : values.heightFt,
  };
}
