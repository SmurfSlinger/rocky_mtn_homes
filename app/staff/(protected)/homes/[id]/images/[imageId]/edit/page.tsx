import { replaceGalleryImageAction } from "@/app/staff/(protected)/homes/[id]/images/actions";
import { GalleryImageUploadForm } from "@/components/staff/GalleryImageUploadForm";
import { getHomeImageForHome } from "@/lib/db/home-image-mutations";
import { getHomeById } from "@/lib/db/homes";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string; imageId: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditGalleryImagePage({ params }: PageProps) {
  const { id, imageId: imageIdParam } = await params;
  const homeId = Number(id);
  const imageId = Number(imageIdParam);

  if (
    !Number.isInteger(homeId) ||
    homeId <= 0 ||
    !Number.isInteger(imageId) ||
    imageId <= 0
  ) {
    notFound();
  }

  const home = await getHomeById(homeId);
  const image = await getHomeImageForHome(imageId, homeId);

  if (!home || !image) {
    notFound();
  }

  const boundAction = replaceGalleryImageAction.bind(null, homeId, imageId);

  return (
    <main className="px-6 py-12">
      <GalleryImageUploadForm
        action={boundAction}
        backHref={`/staff/homes/${homeId}/images`}
        title="Replace Gallery Image"
        submitLabel="Replace Image"
        currentImageSrc={image.imagePath}
        currentImageAlt={`Gallery image ${image.id}`}
      />
    </main>
  );
}
