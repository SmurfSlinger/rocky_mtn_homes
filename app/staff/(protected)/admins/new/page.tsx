import { createAdminAction } from "@/app/staff/(protected)/admins/actions";
import { AdminForm } from "@/components/staff/AdminForm";

export const metadata = {
  title: "Create Admin",
};

export const dynamic = "force-dynamic";

export default function NewAdminPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold text-[#5C4033]">
        Create New Admin
      </h1>
      <div className="rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-8 shadow-lg">
        <AdminForm mode="create" action={createAdminAction} />
      </div>
    </main>
  );
}
