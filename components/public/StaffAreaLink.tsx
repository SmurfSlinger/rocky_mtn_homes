import { getStaffSession } from "@/lib/auth/session";
import Link from "next/link";

type StaffAreaLinkProps = {
  className?: string;
};

export async function StaffAreaLink({ className }: StaffAreaLinkProps) {
  const session = await getStaffSession();

  return (
    <Link
      href={session ? "/staff/homes" : "/staff/login"}
      className={className}
    >
      {session ? "Staff Dashboard" : "Staff Login"}
    </Link>
  );
}
