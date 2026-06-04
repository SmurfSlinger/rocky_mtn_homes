import { ImageCarousel } from "@/components/public/ImageCarousel";
import { displayFeature, displayValue } from "@/lib/display";
import { getHomeById, getHomeGalleryForDetail } from "@/lib/db/homes";
import { cardClassName } from "@/lib/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const home = await getHomeById(Number(id));
  return {
    title: home?.title ?? "Home Details",
  };
}

export default async function HomeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const result = await getHomeGalleryForDetail(numericId);
  if (!result) {
    notFound();
  }

  const { home, galleryPaths } = result;
  const statusLabel =
    home.status.charAt(0).toUpperCase() + home.status.slice(1);

  return (
    <main className="min-h-screen bg-[#FDF6EC] px-6 py-12">
      <div className={`mx-auto max-w-5xl p-8 ${cardClassName}`}>
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#5C4033]">
          {home.title}
        </h1>
        {home.price ? (
          <p className="mb-6 text-lg font-semibold text-[#8B2C2C]">{home.price}</p>
        ) : null}

        <p className="mb-6">
          <Link
            href="/inventory"
            className="text-sm text-[#8B2C2C] hover:underline"
          >
            &laquo; Back to Inventory
          </Link>
        </p>

        <h2 className="mb-4 text-2xl font-semibold text-[#5C4033]">Gallery</h2>
        <div className="mb-10">
          <ImageCarousel images={galleryPaths} alt={home.title} />
        </div>

        <p className="mb-8 text-base leading-relaxed text-[#4b3621]">
          {home.description}
        </p>

        <div className="mb-4 grid grid-cols-1 gap-x-8 gap-y-4 text-sm text-[#4b3621] sm:grid-cols-2">
          <Spec label="Square Footage" value={`${displayValue(home.squareFootage)} sq ft`} />
          <Spec
            label="Dimensions"
            value={`${displayValue(home.lengthFt)} x ${displayValue(home.widthFt)} ft`}
          />
          <Spec label="Bedrooms" value={displayValue(home.bedrooms)} />
          <Spec label="Bathrooms" value={displayValue(home.bathrooms)} />
          <Spec
            label="Washer/Dryer Hookups"
            value={displayFeature(home.hasWasherDryerHookups)}
          />
          <Spec label="Air Conditioning" value={displayFeature(home.hasAc)} />
          <Spec label="Furnace" value={displayFeature(home.hasFurnace)} />
          <Spec
            label="Includes Appliances"
            value={displayFeature(home.includesAppliances)}
          />
          <Spec label="Flooring Type" value={displayValue(home.flooringType)} />
          <Spec label="Year Built" value={displayValue(home.yearBuilt)} />
          <Spec label="Extras" value={displayValue(home.extras)} />
          <Spec label="Status" value={displayValue(statusLabel)} />
        </div>
      </div>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong className="text-[#5C4033]">{label}:</strong> {value}
    </p>
  );
}
