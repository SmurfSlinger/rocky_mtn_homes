import { getAllHomes } from "@/lib/db/homes";
import Link from "next/link";

export const metadata = {
  title: "Manage Homes",
};

export const dynamic = "force-dynamic";

export default async function StaffHomesPage() {
  const homes = await getAllHomes();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-[#5C4033]">
          Manage Homes
        </h1>
        <Link
          href="/staff/homes/new"
          className="rounded bg-[#8B2C2C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#A94438]"
        >
          + Add New Home
        </Link>
      </div>

      {homes.length === 0 ? (
        <p className="text-[#4b3621]">No homes in inventory yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#D2B48C] bg-white shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-[#5C4033]">
                <th className="border-b border-[#D2B48C] p-3">Title</th>
                <th className="border-b border-[#D2B48C] p-3">Price</th>
                <th className="border-b border-[#D2B48C] p-3">Sq Ft</th>
                <th className="border-b border-[#D2B48C] p-3">Status</th>
                <th className="border-b border-[#D2B48C] p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {homes.map((home) => (
                <tr key={home.id} className="text-[#4b3621]">
                  <td className="border-b border-[#D2B48C]/50 p-3">
                    <Link
                      href={`/staff/homes/${home.id}`}
                      className="font-medium text-[#8B2C2C] hover:underline"
                    >
                      {home.title}
                    </Link>
                  </td>
                  <td className="border-b border-[#D2B48C]/50 p-3">
                    {home.price ?? "—"}
                  </td>
                  <td className="border-b border-[#D2B48C]/50 p-3">
                    {home.squareFootage}
                  </td>
                  <td className="border-b border-[#D2B48C]/50 p-3 capitalize">
                    {home.status}
                  </td>
                  <td className="border-b border-[#D2B48C]/50 p-3">
                    <Link
                      href={`/staff/homes/${home.id}/images`}
                      className="text-blue-700 hover:underline"
                    >
                      Images
                    </Link>
                    <span className="mx-2 text-gray-400">|</span>
                    <Link
                      href={`/staff/homes/${home.id}/edit`}
                      className="text-blue-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="mx-2 text-gray-400">|</span>
                    <Link
                      href={`/staff/homes/${home.id}/delete`}
                      className="text-red-700 hover:underline"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
