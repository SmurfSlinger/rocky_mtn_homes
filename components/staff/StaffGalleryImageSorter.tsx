"use client";

import type { ReorderGalleryImagesResult } from "@/app/staff/(protected)/homes/[id]/images/actions";
import { DeleteGalleryImageButton } from "@/components/staff/DeleteGalleryImageButton";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export type StaffGalleryImageItem = {
  id: number;
  imagePath: string;
};

type StaffGalleryImageSorterProps = {
  homeId: number;
  initialImages: StaffGalleryImageItem[];
  reorderGalleryImagesAction: (
    homeId: number,
    orderedImageIds: number[],
  ) => Promise<ReorderGalleryImagesResult>;
  deleteGalleryImageAction: (homeId: number, imageId: number) => Promise<void>;
};

function SortableGalleryRow({
  homeId,
  image,
  index,
  deleteGalleryImageAction,
}: {
  homeId: number;
  image: StaffGalleryImageItem;
  index: number;
  deleteGalleryImageAction: (homeId: number, imageId: number) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteAction = deleteGalleryImageAction.bind(null, homeId, image.id);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch gap-3 rounded-lg border bg-white shadow-sm ${
        isDragging
          ? "z-10 border-[#8B2C2C] opacity-90 shadow-lg"
          : "border-[#D2B48C]"
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className="flex w-12 shrink-0 cursor-grab flex-col items-center justify-center gap-1 rounded-l-lg bg-[#8B2C2C] text-white active:cursor-grabbing touch-none"
        title="Drag to reorder"
        aria-label={`Drag to reorder image ${index + 1}`}
        {...attributes}
        {...listeners}
      >
        <span className="text-xs font-bold">{index + 1}</span>
        <span className="text-base leading-none" aria-hidden>
          ⠿
        </span>
      </button>

      <div className="relative my-2 h-28 w-40 shrink-0 overflow-hidden rounded-md">
        <Image
          src={image.imagePath}
          alt={`Gallery image ${index + 1}`}
          fill
          className="object-cover"
          sizes="160px"
          draggable={false}
        />
      </div>

      <div className="relative min-h-28 flex-1 py-2 pr-2">
        <Link
          href={`/staff/homes/${homeId}/images/${image.id}/edit`}
          className="absolute left-0 top-2 z-10 rounded bg-amber-500 px-2 py-1 text-sm text-white hover:bg-amber-600"
        >
          Edit
        </Link>
        <DeleteGalleryImageButton action={deleteAction} />
      </div>
    </li>
  );
}

export function StaffGalleryImageSorter({
  homeId,
  initialImages,
  reorderGalleryImagesAction,
  deleteGalleryImageAction,
}: StaffGalleryImageSorterProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialImages);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(initialImages);
  }, [initialImages]);

  const persistOrder = useCallback(
    (ordered: StaffGalleryImageItem[]) => {
      startTransition(async () => {
        const result = await reorderGalleryImagesAction(
          homeId,
          ordered.map((item) => item.id),
        );
        if (result.ok) {
          setStatusMessage("Order saved.");
          router.refresh();
        } else {
          setStatusMessage(result.error);
          setItems(initialImages);
        }
      });
    },
    [homeId, initialImages, reorderGalleryImagesAction, router],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) {
        return prev;
      }
      const next = arrayMove(prev, oldIndex, newIndex);
      persistOrder(next);
      return next;
    });
    setStatusMessage(null);
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[#D2B48C] bg-[#FAF4E6] p-6 text-center text-[#4b3621]">
        No gallery images yet. Upload images below, then drag the handle on the
        left to reorder.
      </p>
    );
  }

  return (
    <div className="rounded-xl border-2 border-[#8B2C2C]/30 bg-[#FAF4E6] p-4">
      <p className="mb-1 text-base font-semibold text-[#5C4033]">
        Drag and drop to reorder
      </p>
      <p className="mb-4 text-sm text-[#4b3621]">
        Grab the red handle on each row and drag up or down. Order is saved
        automatically and appears on the public home page after the cover image.
      </p>

      {statusMessage ? (
        <p
          role="status"
          className={`mb-4 text-sm font-medium ${
            statusMessage === "Order saved."
              ? "text-green-800"
              : "text-red-800"
          }`}
        >
          {statusMessage}
          {isPending ? " Saving…" : null}
        </p>
      ) : isPending ? (
        <p role="status" className="mb-4 text-sm text-[#4b3621]">
          Saving order…
        </p>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3" aria-label="Gallery images, drag to reorder">
            {items.map((image, index) => (
              <SortableGalleryRow
                key={image.id}
                homeId={homeId}
                image={image}
                index={index}
                deleteGalleryImageAction={deleteGalleryImageAction}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
