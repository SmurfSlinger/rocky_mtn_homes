import {
  deleteGalleryImageAction,
  reorderGalleryImagesAction,
} from "@/app/staff/(protected)/homes/[id]/images/actions";
import { StaffGalleryImageSorter } from "@/components/staff/StaffGalleryImageSorter";
import { getHomeById, getHomeImagesByHomeId } from "@/lib/db/homes";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ warning?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const home = await getHomeById(Number(id));
  return { title: home ? `Images — ${home.title}` : "Images" };
}

export default async function StaffHomeImagesPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { warning } = await searchParams;
  const homeId = Number(id);

  if (!Number.isInteger(homeId) || homeId <= 0) {
    notFound();
  }

  const home = await getHomeById(homeId);
  if (!home) {
    notFound();
  }

  const galleryImages = await getHomeImagesByHomeId(homeId);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold text-[#5C4033]">
        Images for {home.title}
      </h1>

      {warning ? (
        <div
          role="status"
          className="mb-6 rounded border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900"
        >
          {warning}
        </div>
      ) : null}

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-[#5C4033]">Cover image</h2>
        <p className="mb-3 text-sm text-[#4b3621]">
          The cover photo is shown on inventory cards and as the first gallery
          image on the public detail page. Replace it from{" "}
          <Link
            href={`/staff/homes/${homeId}/edit`}
            className="text-[#8B2C2C] hover:underline"
          >
            Edit Home
          </Link>
          .
        </p>
        <div className="relative h-48 max-w-md overflow-hidden rounded-lg border border-[#D2B48C] shadow">
          <Image
            src={home.imagePath}
            alt={`Cover for ${home.title}`}
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#5C4033]">
              Gallery images
            </h2>
            <p className="text-sm text-[#4b3621]">
              {galleryImages.length > 0
                ? `${galleryImages.length} image${galleryImages.length === 1 ? "" : "s"} — drag to reorder`
                : "Upload images, then drag to set gallery order"}
            </p>
          </div>
          <Link
            href={`/staff/homes/${homeId}/images/new`}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Upload New Image
          </Link>
        </div>

        <StaffGalleryImageSorter
          homeId={homeId}
          initialImages={galleryImages.map((image) => ({
            id: image.id,
            imagePath: image.imagePath,
          }))}
          reorderGalleryImagesAction={reorderGalleryImagesAction}
          deleteGalleryImageAction={deleteGalleryImageAction}
        />
      </section>

      <p className="mt-8 text-sm">
        <Link
          href={`/staff/homes/${homeId}`}
          className="text-[#8B2C2C] hover:underline"
        >
          &laquo; Back to home
        </Link>
        {" · "}
        <Link href="/staff/homes" className="text-[#8B2C2C] hover:underline">
          Manage homes
        </Link>
        {" · "}
        <Link href="/inventory" className="text-[#8B2C2C] hover:underline">
          View public inventory
        </Link>
      </p>
    </main>
  );
}
