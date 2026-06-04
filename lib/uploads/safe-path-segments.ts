/**
 * Rejects path segments that could escape the intended directory (e.g. `..`).
 */
export function assertSafePathSegments(segments: string[]): boolean {
  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") {
      return false;
    }
    if (segment.includes("/") || segment.includes("\\") || segment.includes("\0")) {
      return false;
    }
  }
  return true;
}
