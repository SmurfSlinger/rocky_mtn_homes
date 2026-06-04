import { deleteAdminAction } from "@/app/staff/(protected)/admins/actions";
import { getStaffSession } from "@/lib/auth/session";
import { countAdmins, getAdminPublicById } from "@/lib/db/admin-mutations";
import { adminFullName } from "@/lib/types/admin-public";
import { cardClassName, buttonPrimaryClassName } from "@/lib/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function DeleteAdminPage({ params }: PageProps) {
  const { id } = await params;
  const adminId = Number(id);

  if (!Number.isInteger(adminId) || adminId <= 0) {
    notFound();
  }

  const session = await getStaffSession();
  const admin = await getAdminPublicById(adminId);

  if (!admin) {
    notFound();
  }

  if (session?.adminId === adminId) {
    redirect("/staff/admins?error=self-delete");
  }

  const total = await countAdmins();
  if (total <= 1) {
    redirect("/staff/admins?error=last-admin");
  }

  const boundDelete = deleteAdminAction.bind(null, adminId);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className={`${cardClassName} p-8 text-[#5C4033]`}>
        <h1 className="mb-6 text-2xl font-bold">Delete Admin User</h1>

        <p className="mb-6 text-[#4b3621]">
          Are you sure you want to delete admin{" "}
          <strong>{adminFullName(admin)}</strong> ({admin.username})?
        </p>

        <form
          action={boundDelete}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <Link
            href="/staff/admins"
            className="rounded bg-gray-300 px-4 py-2 font-semibold text-[#5C4033] hover:bg-gray-400"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`${buttonPrimaryClassName} bg-red-600 hover:bg-red-700`}
          >
            Yes, Delete Admin
          </button>
        </form>
      </div>
    </main>
  );
}
