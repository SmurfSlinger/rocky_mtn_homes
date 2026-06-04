export function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Inquire";
  }
  if (typeof value === "number" && value === 0) {
    return "Inquire";
  }
  return String(value);
}

export function displayFeature(value: boolean | null): string {
  if (value === null) {
    return "Inquire";
  }
  return value ? "Yes" : "Inquire";
}
