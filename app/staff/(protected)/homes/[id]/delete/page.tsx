import { deleteHomeAction } from "@/app/staff/(protected)/homes/actions";
import { getHomeById } from "@/lib/db/homes";
import { cardClassName, buttonPrimaryClassName } from "@/lib/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function DeleteHomePage({ params }: PageProps) {
  const { id } = await params;
  const homeId = Number(id);

  if (!Number.isInteger(homeId) || homeId <= 0) {
    notFound();
  }

  const home = await getHomeById(homeId);
  if (!home) {
    notFound();
  }

  const boundDelete = deleteHomeAction.bind(null, homeId);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className={`${cardClassName} p-8 text-[#5C4033]`}>
        <h1 className="mb-6 text-center font-serif text-3xl font-bold">
          Confirm Deletion
        </h1>

        <p className="mb-4 text-lg leading-relaxed text-[#4b3621]">
          Are you sure you want to delete this home from the inventory? Related
          gallery rows in <code className="text-sm">home_images</code> will also
          be removed.
        </p>

        <div className="mb-6 rounded-lg border border-[#D2B48C] bg-[#FDF6EC] p-4 shadow-sm">
          <p>
            <strong>Title:</strong> {home.title}
          </p>
          <p>
            <strong>Price:</strong> {home.price ?? "—"}
          </p>
        </div>

        <form
          action={boundDelete}
          className="flex items-center justify-between gap-4"
        >
          <Link
            href="/staff/homes"
            className="rounded bg-gray-300 px-4 py-2 font-semibold text-[#5C4033] transition hover:bg-gray-400"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`${buttonPrimaryClassName} bg-[#8B2C2C] hover:bg-[#A94438]`}
          >
            Delete Home
          </button>
        </form>
      </div>
    </main>
  );
}
