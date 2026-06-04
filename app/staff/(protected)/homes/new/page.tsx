import { createHomeAction } from "@/app/staff/(protected)/homes/actions";
import { HomeForm } from "@/components/staff/HomeForm";

export const metadata = {
  title: "Add New Home",
};

export const dynamic = "force-dynamic";

export default function NewHomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 font-serif text-2xl font-bold text-[#5C4033]">
        Add New Home
      </h1>
      <div className="rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-6 shadow-lg">
        <HomeForm mode="create" action={createHomeAction} />
      </div>
    </main>
  );
}
