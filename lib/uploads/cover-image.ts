import "server-only";

import {
  saveHomeImageFile,
  type HomeImageUploadResult,
} from "@/lib/uploads/home-image";

export type CoverImageResult = HomeImageUploadResult;

/** @deprecated Use saveHomeImageFile — kept for existing home form actions. */
export async function saveCoverImage(file: File): Promise<CoverImageResult> {
  return saveHomeImageFile(file);
}
