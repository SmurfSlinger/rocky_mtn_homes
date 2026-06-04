import { HomeCard } from "@/components/public/HomeCard";
import { getHomesForPublicInventory } from "@/lib/db/homes";

export const metadata = {
  title: "Available Homes",
};

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const homes = await getHomesForPublicInventory();

  return (
    <main className="min-h-screen bg-[#FDF6EC] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-3 text-center font-serif text-4xl text-[#5C4033]">
          Available Homes
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-center text-[#4b3621]">
          Browse our current manufactured home listings in Utah. Click a home for
          photos, dimensions, and features.
        </p>

        {homes.length === 0 ? (
          <p className="text-center text-lg text-[#4b3621]">
            No homes are listed at this time. Please check back soon or{" "}
            <a href="/contact" className="text-[#8B2C2C] hover:underline">
              contact us
            </a>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {homes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
