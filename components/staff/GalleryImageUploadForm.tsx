"use client";

import type { GalleryImageFormState } from "@/app/staff/(protected)/homes/[id]/images/actions";
import { inputClassName, buttonPrimaryClassName } from "@/lib/ui";
import Link from "next/link";
import { useActionState } from "react";

type GalleryImageUploadFormProps = {
  action: (
    prevState: GalleryImageFormState,
    formData: FormData,
  ) => Promise<GalleryImageFormState>;
  backHref: string;
  title: string;
  submitLabel: string;
  currentImageSrc?: string;
  currentImageAlt?: string;
};

export function GalleryImageUploadForm({
  action,
  backHref,
  title,
  submitLabel,
  currentImageSrc,
  currentImageAlt,
}: GalleryImageUploadFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-[#5C4033]">{title}</h1>

      {state.errors && state.errors.length > 0 && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-sm text-red-700"
        >
          <ul className="list-disc pl-5">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {state.warning && (
        <div className="mb-4 rounded border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          {state.warning}
        </div>
      )}

      {currentImageSrc ? (
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg border border-[#D2B48C]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImageSrc}
            alt={currentImageAlt ?? "Current gallery image"}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <form
        action={formAction}
        encType="multipart/form-data"
        className="space-y-4 rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-6 shadow-lg"
      >
        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-semibold">
            {currentImageSrc ? "Select New Image" : "Select Image"} *
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            className={`${inputClassName} bg-white`}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimaryClassName} disabled:opacity-60`}
        >
          {pending ? "Uploading…" : submitLabel}
        </button>
      </form>

      <p className="mt-4">
        <Link href={backHref} className="text-[#8B2C2C] hover:underline">
          &laquo; Back to Images
        </Link>
      </p>
    </div>
  );
}
