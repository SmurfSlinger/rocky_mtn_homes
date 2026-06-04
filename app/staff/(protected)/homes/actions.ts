"use server";

import { requireStaffSession } from "@/lib/auth/guards";
import {
  createHomeRecord,
  deleteHomeRecord,
  getHomeImagePathFromDb,
  updateHomeRecord,
} from "@/lib/db/home-mutations";
import { homeFormValuesToDbPayload } from "@/lib/db/home-payload";
import { getHomeById } from "@/lib/db/homes";
import {
  getImageFileFromFormData,
  parseHomeFormData,
} from "@/lib/staff/parse-home-form";
import type { HomeFormState } from "@/lib/types/home-form";
import { validateHomeForm } from "@/lib/validation/home";
import { cleanupReplacedCoverImage } from "@/lib/staff/cover-image-cleanup";
import { saveHomeImageFile } from "@/lib/uploads/home-image";
import { redirect } from "next/navigation";

function failure(
  errors: string[],
  values: ReturnType<typeof parseHomeFormData>,
): HomeFormState {
  return { errors, values };
}

export async function createHomeAction(
  _prevState: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  await requireStaffSession();

  const values = parseHomeFormData(formData);
  const imageFile = getImageFileFromFormData(formData);

  const errors = validateHomeForm(values, {
    requireImage: true,
    hasImageFile: imageFile !== null,
  });

  if (errors.length > 0) {
    return failure(errors, values);
  }

  if (!imageFile) {
    return failure(["Cover image is required."], values);
  }

  const upload = await saveHomeImageFile(imageFile);
  if (!upload.ok) {
    return failure([upload.error], values);
  }

  const payload = homeFormValuesToDbPayload(values, upload.imagePath);
  const id = await createHomeRecord(payload);

  redirect(`/staff/homes/${id}`);
}

export async function updateHomeAction(
  homeId: number,
  _prevState: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  await requireStaffSession();

  const existing = await getHomeById(homeId);
  if (!existing) {
    redirect("/staff/homes");
  }

  const values = parseHomeFormData(formData);
  const imageFile = getImageFileFromFormData(formData);

  const errors = validateHomeForm(values, {
    hasImageFile: imageFile !== null,
  });

  if (errors.length > 0) {
    return failure(errors, values);
  }

  const previousCoverPath = await getHomeImagePathFromDb(homeId);
  let imagePath = previousCoverPath;

  if (imageFile) {
    const upload = await saveHomeImageFile(imageFile);
    if (!upload.ok) {
      return failure([upload.error], values);
    }
    imagePath = upload.imagePath;
  }

  if (!imagePath) {
    return failure(["Cover image is required."], values);
  }

  const payload = homeFormValuesToDbPayload(values, imagePath);
  const updated = await updateHomeRecord(homeId, payload);

  if (!updated) {
    return failure(["Failed to update home."], values);
  }

  if (imageFile && previousCoverPath) {
    await cleanupReplacedCoverImage(homeId, previousCoverPath, imagePath);
  }

  redirect(`/staff/homes/${homeId}`);
}

export async function deleteHomeAction(homeId: number): Promise<void> {
  await requireStaffSession();

  const home = await getHomeById(homeId);
  if (!home) {
    redirect("/staff/homes");
  }

  const deleted = await deleteHomeRecord(homeId);
  if (!deleted) {
    throw new Error("Failed to delete home.");
  }

  redirect("/staff/homes");
}
