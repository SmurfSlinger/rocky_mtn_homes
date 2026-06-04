import "server-only";

import fs from "fs/promises";
import path from "path";
import { HOME_IMAGE_UPLOAD_SUBDIR } from "@/lib/uploads/home-image";

export type DeleteImageFileResult = {
  deleted: boolean;
  warning?: string;
};

/**
 * Deletes a file under public/images/homes. Never throws — returns a warning
 * when the file could not be removed.
 */
export async function deleteImageFileSafe(
  relativePath: string | null | undefined,
): Promise<DeleteImageFileResult> {
  const trimmed = (relativePath ?? "").trim().replace(/^\/+/, "");
  if (!trimmed) {
    return { deleted: false };
  }

  if (!trimmed.startsWith(`${HOME_IMAGE_UPLOAD_SUBDIR}/`)) {
    return {
      deleted: false,
      warning: "Skipped deleting file outside the uploads directory.",
    };
  }

  const absolute = path.join(process.cwd(), "public", trimmed);

  try {
    await fs.unlink(absolute);
    return { deleted: true };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return { deleted: false };
    }
    return {
      deleted: false,
      warning: "The database was updated but the image file could not be removed from disk.",
    };
  }
}
