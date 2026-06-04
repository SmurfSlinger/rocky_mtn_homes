import { StaffAreaLink } from "@/components/public/StaffAreaLink";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Available Homes" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
] as const;

export function PublicFooter() {
  return (
    <footer className="mt-auto bg-rose-900 py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm md:flex-row">
        <p>
          © {new Date().getFullYear()} Rocky Mountain Home Sales. All rights
          reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition hover:text-amber-300"
            >
              {label}
            </Link>
          ))}
          <StaffAreaLink className="transition hover:text-amber-300" />
        </div>
      </div>
    </footer>
  );
}
