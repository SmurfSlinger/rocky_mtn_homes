import { StaffHeader } from "@/components/staff/StaffHeader";
import { requireStaffSession } from "@/lib/auth/guards";

export default async function StaffProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireStaffSession();

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF6EC]">
      <StaffHeader session={session} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
