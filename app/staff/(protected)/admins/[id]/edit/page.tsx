import { updateAdminAction } from "@/app/staff/(protected)/admins/actions";
import { AdminForm } from "@/components/staff/AdminForm";
import { getAdminPublicById } from "@/lib/db/admin-mutations";
import { adminPublicToFormValues } from "@/lib/staff/parse-admin-form";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Edit Admin #${id}` };
}

export default async function EditAdminPage({ params }: PageProps) {
  const { id } = await params;
  const adminId = Number(id);

  if (!Number.isInteger(adminId) || adminId <= 0) {
    notFound();
  }

  const admin = await getAdminPublicById(adminId);
  if (!admin) {
    notFound();
  }

  const boundUpdate = updateAdminAction.bind(null, adminId);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold text-[#5C4033]">Edit Admin User</h1>
      <div className="rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-8 shadow-lg">
        <AdminForm
          mode="edit"
          action={boundUpdate}
          initialValues={adminPublicToFormValues(admin)}
          adminId={adminId}
        />
      </div>
    </main>
  );
}
