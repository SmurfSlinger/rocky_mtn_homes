"use client";

import type { HomeFormState, HomeFormValues } from "@/lib/types/home-form";
import { emptyHomeFormValues } from "@/lib/types/home-form";
import { inputClassName, buttonPrimaryClassName } from "@/lib/ui";
import Link from "next/link";
import { useActionState } from "react";

type HomeFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: HomeFormState,
    formData: FormData,
  ) => Promise<HomeFormState>;
  initialValues?: HomeFormValues;
  homeId?: number;
};

export function HomeForm({
  mode,
  action,
  initialValues,
  homeId,
}: HomeFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  const v = state.values ?? initialValues ?? emptyHomeFormValues;
  const errors = state.errors ?? [];
  const currentYear = new Date().getFullYear();

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-5">
      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded border border-red-400 bg-red-100 p-4 text-sm text-red-700"
        >
          <ul className="list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <p>
        <Link href="/staff/homes" className="text-[#8B2C2C] hover:underline">
          &laquo; Back to Homes
        </Link>
      </p>

      <Field label="Title *">
        <input
          type="text"
          name="title"
          required
          defaultValue={v.title}
          className={inputClassName}
          placeholder="Enter home title"
        />
      </Field>

      <Field label="Price ($)">
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          defaultValue={v.price}
          className={inputClassName}
          placeholder="0.00"
        />
      </Field>

      <Field label="Square Footage *">
        <input
          type="number"
          name="square_footage"
          min="0"
          required
          defaultValue={v.squareFootage}
          className={inputClassName}
        />
      </Field>

      <Field label="Dimensions (L × W × H in ft) *">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            type="number"
            name="length_ft"
            min="0"
            step="any"
            required
            defaultValue={v.lengthFt}
            placeholder="Length"
            className={inputClassName}
          />
          <input
            type="number"
            name="width_ft"
            min="0"
            step="any"
            required
            defaultValue={v.widthFt}
            placeholder="Width"
            className={inputClassName}
          />
          <input
            type="number"
            name="height_ft"
            min="0"
            step="any"
            defaultValue={v.heightFt}
            placeholder="Height"
            className={inputClassName}
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Bedrooms">
          <input
            type="number"
            name="bedrooms"
            min="0"
            defaultValue={v.bedrooms}
            className={inputClassName}
          />
        </Field>
        <Field label="Bathrooms">
          <input
            type="number"
            name="bathrooms"
            min="0"
            step="0.5"
            defaultValue={v.bathrooms}
            className={inputClassName}
          />
        </Field>
      </div>

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-[#5C4033]">
          Features
        </legend>
        <Checkbox
          name="has_washer_dryer_hookups"
          label="Washer/Dryer Hookups"
          defaultChecked={v.hasWasherDryerHookups}
        />
        <Checkbox name="has_ac" label="Air Conditioning" defaultChecked={v.hasAc} />
        <Checkbox name="has_furnace" label="Furnace" defaultChecked={v.hasFurnace} />
        <Checkbox
          name="includes_appliances"
          label="Includes Appliances"
          defaultChecked={v.includesAppliances}
        />
      </fieldset>

      <Field label="Flooring Type">
        <input
          type="text"
          name="flooring_type"
          defaultValue={v.flooringType}
          className={inputClassName}
        />
      </Field>

      <Field label="Year Built">
        <input
          type="number"
          name="year_built"
          min="1800"
          max={currentYear}
          defaultValue={v.yearBuilt}
          className={inputClassName}
        />
      </Field>

      <Field label="Extras / Comments">
        <textarea
          name="extras"
          rows={3}
          defaultValue={v.extras}
          className={inputClassName}
          placeholder="Features, model notes, garage, porch, etc."
        />
        <p className="mt-1 text-xs text-[#4b3621]">
          Inventory cards show beds and baths only (from the fields above). Put
          features and other details here.
        </p>
      </Field>

      <Field
        label={
          mode === "create"
            ? "Cover Image *"
            : "Replace Cover Photo (optional)"
        }
      >
        <input
          type="file"
          name="image"
          accept="image/*"
          required={mode === "create"}
          className={`${inputClassName} bg-white`}
        />
      </Field>

      <Field label="Status *">
        <select
          name="status"
          required
          defaultValue={v.status}
          className={inputClassName}
        >
          <option value="">Select status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {mode === "edit" && homeId ? (
          <Link
            href={`/staff/homes/${homeId}`}
            className="text-sm text-[#4b3621] hover:underline"
          >
            Cancel
          </Link>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimaryClassName} disabled:opacity-60`}
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Add Home"
              : "Update Home"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[#5C4033]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#4b3621]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[#D2B48C]"
      />
      {label}
    </label>
  );
}
