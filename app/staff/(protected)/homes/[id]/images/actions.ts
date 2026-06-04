"use server";

import { requireStaffSession } from "@/lib/auth/guards";
import {
  createHomeImageRecord,
  deleteHomeImageRecord,
  getHomeImageForHome,
  isImagePathReferencedByHome,
  reorderHomeGalleryImages,
  updateHomeImageRecordPath,
} from "@/lib/db/home-image-mutations";
import { getHomeById } from "@/lib/db/homes";
import { cleanupReplacedCoverImage } from "@/lib/staff/cover-image-cleanup";
import { getImageFileFromFormData } from "@/lib/staff/parse-home-form";
import { deleteImageFileSafe } from "@/lib/uploads/delete-image-file";
import { saveHomeImageFile } from "@/lib/uploads/home-image";
import { redirect } from "next/navigation";

export type GalleryImageFormState = {
  errors?: string[];
  warning?: string;
};

function failure(
  errors: string[],
  warning?: string,
): GalleryImageFormState {
  return { errors, warning };
}

async function requireHome(homeId: number) {
  const home = await getHomeById(homeId);
  if (!home) {
    redirect("/staff/homes");
  }
  return home;
}

export async function createGalleryImageAction(
  homeId: number,
  _prevState: GalleryImageFormState,
  formData: FormData,
): Promise<GalleryImageFormState> {
  await requireStaffSession();
  await requireHome(homeId);

  const imageFile = getImageFileFromFormData(formData);
  if (!imageFile) {
    return failure(["Please select a valid image to upload."]);
  }

  const upload = await saveHomeImageFile(imageFile);
  if (!upload.ok) {
    return failure([upload.error]);
  }

  await createHomeImageRecord(homeId, upload.imagePath);
  redirect(`/staff/homes/${homeId}/images`);
}

export async function replaceGalleryImageAction(
  homeId: number,
  imageId: number,
  _prevState: GalleryImageFormState,
  formData: FormData,
): Promise<GalleryImageFormState> {
  await requireStaffSession();
  await requireHome(homeId);

  const existing = await getHomeImageForHome(imageId, homeId);
  if (!existing) {
    redirect(`/staff/homes/${homeId}/images`);
  }

  const imageFile = getImageFileFromFormData(formData);
  if (!imageFile) {
    return failure(["Please select a valid image to upload."]);
  }

  const upload = await saveHomeImageFile(imageFile);
  if (!upload.ok) {
    return failure([upload.error]);
  }

  const previousPath = existing.imagePath;
  const updated = await updateHomeImageRecordPath(
    imageId,
    homeId,
    upload.imagePath,
  );

  if (!updated) {
    await deleteImageFileSafe(upload.imagePath);
    return failure(["Failed to update the image record."]);
  }

  let warning: string | undefined;

  const coverWarning = await cleanupReplacedCoverImage(
    homeId,
    previousPath,
    upload.imagePath,
  );
  warning = coverWarning;

  const stillUsed = await isImagePathReferencedByHome(homeId, previousPath, {
    excludeGalleryImageId: imageId,
  });

  if (!stillUsed) {
    const deleteResult = await deleteImageFileSafe(previousPath);
    if (deleteResult.warning) {
      warning = warning
        ? `${warning} ${deleteResult.warning}`
        : deleteResult.warning;
    }
  }

  if (warning) {
    redirect(
      `/staff/homes/${homeId}/images?warning=${encodeURIComponent(warning)}`,
    );
  }

  redirect(`/staff/homes/${homeId}/images`);
}

export type ReorderGalleryImagesResult =
  | { ok: true }
  | { ok: false; error: string };

export async function reorderGalleryImagesAction(
  homeId: number,
  orderedImageIds: number[],
): Promise<ReorderGalleryImagesResult> {
  await requireStaffSession();
  await requireHome(homeId);

  if (!Array.isArray(orderedImageIds) || orderedImageIds.length === 0) {
    return { ok: false, error: "No images to reorder." };
  }

  const ids = orderedImageIds
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (ids.length !== orderedImageIds.length) {
    return { ok: false, error: "Invalid image order." };
  }

  const success = await reorderHomeGalleryImages(homeId, ids);
  if (!success) {
    return { ok: false, error: "Could not save image order. Refresh and try again." };
  }

  return { ok: true };
}

export async function deleteGalleryImageAction(
  homeId: number,
  imageId: number,
): Promise<void> {
  await requireStaffSession();
  await requireHome(homeId);

  const removed = await deleteHomeImageRecord(imageId, homeId);
  if (!removed) {
    redirect(`/staff/homes/${homeId}/images`);
  }

  const stillUsed = await isImagePathReferencedByHome(
    homeId,
    removed.imagePath,
  );

  if (!stillUsed) {
    const deleteResult = await deleteImageFileSafe(removed.imagePath);
    if (deleteResult.warning) {
      redirect(
        `/staff/homes/${homeId}/images?warning=${encodeURIComponent(deleteResult.warning)}`,
      );
    }
  }

  redirect(`/staff/homes/${homeId}/images`);
}
