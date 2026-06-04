import { getAllAdminsPublic } from "@/lib/db/admin-mutations";
import { adminFullName } from "@/lib/types/admin-public";
import Link from "next/link";

export const metadata = {
  title: "Manage Admins",
};

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  "self-delete": "You cannot delete your own account while logged in.",
  "last-admin": "Cannot delete the only remaining admin account.",
  "delete-failed": "Failed to delete admin. Please try again.",
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function StaffAdminsPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const admins = await getAllAdminsPublic();
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold text-[#5C4033]">Manage Admin Users</h1>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded border border-red-400 bg-red-100 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-left text-[#5C4033]">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="text-[#4b3621]">
                <td className="border border-gray-300 p-2">{admin.id}</td>
                <td className="border border-gray-300 p-2">
                  {adminFullName(admin)}
                </td>
                <td className="border border-gray-300 p-2">{admin.email}</td>
                <td className="border border-gray-300 p-2">{admin.username}</td>
                <td className="border border-gray-300 p-2">
                  <Link
                    href={`/staff/admins/${admin.id}/edit`}
                    className="text-blue-700 hover:underline"
                  >
                    Edit
                  </Link>
                  <span className="mx-2 text-gray-400">|</span>
                  <Link
                    href={`/staff/admins/${admin.id}/delete`}
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

      <p className="mt-6">
        <Link
          href="/staff/admins/new"
          className="inline-block rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Create New Admin
        </Link>
      </p>
    </main>
  );
}
