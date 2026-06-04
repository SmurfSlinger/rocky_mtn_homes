"use client";

type DeleteGalleryImageButtonProps = {
  action: () => void;
};

export function DeleteGalleryImageButton({
  action,
}: DeleteGalleryImageButtonProps) {
  return (
    <form
      action={action}
      className="absolute right-2 top-2 z-10"
      onSubmit={(event) => {
        if (
          !confirm("Are you sure you want to delete this gallery image?")
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
      >
        Delete
      </button>
    </form>
  );
}
