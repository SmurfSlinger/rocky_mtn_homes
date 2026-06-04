/**
 * Inventory card / listing description: beds and baths only.
 */
export function formatBedsBathsDescription(
  bedrooms: number | null | undefined,
  bathrooms: number | null | undefined,
): string {
  const parts: string[] = [];
  if (bedrooms != null && !Number.isNaN(bedrooms)) {
    parts.push(`${bedrooms} bed`);
  }
  if (bathrooms != null && !Number.isNaN(bathrooms)) {
    parts.push(`${bathrooms} bath`);
  }
  if (parts.length === 0) {
    return "";
  }
  return `${parts.join(", ")}.`;
}
