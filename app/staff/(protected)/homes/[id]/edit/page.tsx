import { updateHomeAction } from "@/app/staff/(protected)/homes/actions";
import { HomeForm } from "@/components/staff/HomeForm";
import { getHomeFormValuesById } from "@/lib/db/home-mutations";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Edit Home #${id}` };
}

export default async function EditHomePage({ params }: PageProps) {
  const { id } = await params;
  const homeId = Number(id);

  if (!Number.isInteger(homeId) || homeId <= 0) {
    notFound();
  }

  const initialValues = await getHomeFormValuesById(homeId);
  if (!initialValues) {
    notFound();
  }

  const boundUpdate = updateHomeAction.bind(null, homeId);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 font-serif text-2xl font-bold text-[#5C4033]">
        Edit Home Listing
      </h1>
      <div className="rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-6 shadow-lg">
        <HomeForm
          mode="edit"
          action={boundUpdate}
          initialValues={initialValues}
          homeId={homeId}
        />
      </div>
    </main>
  );
}
