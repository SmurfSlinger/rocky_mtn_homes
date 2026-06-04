import { createGalleryImageAction } from "@/app/staff/(protected)/homes/[id]/images/actions";
import { GalleryImageUploadForm } from "@/components/staff/GalleryImageUploadForm";
import { getHomeById } from "@/lib/db/homes";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function NewGalleryImagePage({ params }: PageProps) {
  const { id } = await params;
  const homeId = Number(id);

  if (!Number.isInteger(homeId) || homeId <= 0) {
    notFound();
  }

  const home = await getHomeById(homeId);
  if (!home) {
    notFound();
  }

  const boundAction = createGalleryImageAction.bind(null, homeId);

  return (
    <main className="px-6 py-12">
      <GalleryImageUploadForm
        action={boundAction}
        backHref={`/staff/homes/${homeId}/images`}
        title={`Upload Image for ${home.title}`}
        submitLabel="Upload Image"
      />
    </main>
  );
}
