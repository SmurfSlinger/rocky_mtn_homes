import "server-only";

import { isImagePathReferencedByHome } from "@/lib/db/home-image-mutations";
import { deleteImageFileSafe } from "@/lib/uploads/delete-image-file";

/**
 * After replacing a home cover image, remove the previous file when nothing
 * else references it.
 */
export async function cleanupReplacedCoverImage(
  homeId: number,
  previousPath: string,
  newPath: string,
): Promise<string | undefined> {
  const prev = previousPath.trim();
  const next = newPath.trim();

  if (!prev || prev === next) {
    return undefined;
  }

  const stillUsed = await isImagePathReferencedByHome(homeId, prev);
  if (stillUsed) {
    return undefined;
  }

  const result = await deleteImageFileSafe(prev);
  return result.warning;
}
