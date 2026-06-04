import { logoutAction } from "@/app/staff/actions";
import type { StaffSession } from "@/lib/auth/types";
import Link from "next/link";

type StaffHeaderProps = {
  session: StaffSession;
};

const staffNavLinks = [
  { href: "/staff/homes", label: "Manage Homes" },
  { href: "/staff/admins", label: "Manage Admins" },
  { href: "/inventory", label: "View Public Inventory" },
  { href: "/", label: "View Public Site" },
] as const;

export function StaffHeader({ session }: StaffHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[#8B2C2C]/30 bg-[#f8f9fa] shadow-sm"
      aria-label="Staff area"
    >
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8B2C2C]">
          <span className="rounded bg-[#8B2C2C]/10 px-2 py-0.5">Staff area</span>
          <span className="text-[#4b3621]">
            Signed in as <strong>{session.username}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav
            className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#5C4033]"
            aria-label="Staff navigation"
          >
            {staffNavLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-[#8B2C2C]">
                {label}
              </Link>
            ))}
          </nav>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded bg-[#dc3545] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c82333]"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
