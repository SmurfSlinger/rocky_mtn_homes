import { getHomeById } from "@/lib/db/homes";
import { displayFeature, displayValue } from "@/lib/display";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const home = await getHomeById(Number(id));
  return { title: home ? `${home.title} — Staff` : "Home" };
}

export default async function StaffHomeShowPage({ params }: PageProps) {
  const { id } = await params;
  const homeId = Number(id);

  if (!Number.isInteger(homeId) || homeId <= 0) {
    notFound();
  }

  const home = await getHomeById(homeId);
  if (!home) {
    notFound();
  }

  const features: string[] = [];
  if (home.hasAc) features.push("Air Conditioning");
  if (home.hasFurnace) features.push("Furnace");
  if (home.hasWasherDryerHookups) features.push("Washer/Dryer Hookups");
  if (home.includesAppliances) features.push("Includes Appliances");

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold text-[#5C4033]">{home.title}</h1>

      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg border border-[#D2B48C]">
        <Image
          src={home.imagePath}
          alt={home.title}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      <dl className="mb-8 grid grid-cols-1 gap-3 text-sm text-[#4b3621] sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-[#5C4033]">Price</dt>
          <dd>{home.price ?? displayValue(null)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Square Footage</dt>
          <dd>{home.squareFootage} sq ft</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Dimensions</dt>
          <dd>
            {displayValue(home.lengthFt)} × {displayValue(home.widthFt)} ×{" "}
            {displayValue(home.heightFt)} ft
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Status</dt>
          <dd className="capitalize">{home.status}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Bedrooms</dt>
          <dd>{displayValue(home.bedrooms)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Bathrooms</dt>
          <dd>{displayValue(home.bathrooms)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Flooring</dt>
          <dd>{displayValue(home.flooringType)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Year Built</dt>
          <dd>{displayValue(home.yearBuilt)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-[#5C4033]">Description</dt>
          <dd>{home.description || "—"}</dd>
        </div>
        {home.extras ? (
          <div className="sm:col-span-2">
            <dt className="font-semibold text-[#5C4033]">Extras</dt>
            <dd>{home.extras}</dd>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <dt className="font-semibold text-[#5C4033]">Features</dt>
          <dd>
            {features.length > 0 ? (
              <ul className="list-disc pl-5">
                {features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : (
              <span>
                AC: {displayFeature(home.hasAc)}; Furnace:{" "}
                {displayFeature(home.hasFurnace)}
              </span>
            )}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href={`/staff/homes/${home.id}/images`}
          className="text-blue-700 hover:underline"
        >
          Manage Images
        </Link>
        <Link
          href={`/staff/homes/${home.id}/edit`}
          className="text-blue-700 hover:underline"
        >
          Edit
        </Link>
        <Link
          href={`/staff/homes/${home.id}/delete`}
          className="text-red-700 hover:underline"
        >
          Delete
        </Link>
        <Link href="/staff/homes" className="text-[#8B2C2C] hover:underline">
          Back to List
        </Link>
        <Link
          href={`/homes/${home.id}`}
          className="text-[#4b3621] hover:underline"
        >
          View public page
        </Link>
      </div>
    </main>
  );
}
