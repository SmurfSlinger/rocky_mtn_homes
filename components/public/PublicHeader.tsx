import { StaffAreaLink } from "@/components/public/StaffAreaLink";
import { siteAssets } from "@/lib/site-assets";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Available Homes" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
] as const;

export function PublicHeader() {
  return (
    <header className="bg-rose-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 md:flex-row">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <Image
            src={siteAssets.logo}
            alt="Rocky Mountain Logo"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-2xl font-bold tracking-wide md:text-3xl">
            Rocky Mountain Home Sales
          </span>
        </Link>

        <nav
          className="mt-2 flex flex-wrap justify-center gap-4 text-sm md:mt-0 md:justify-end"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition hover:text-amber-300"
            >
              {label}
            </Link>
          ))}
          <StaffAreaLink className="transition hover:text-amber-300" />
        </nav>
      </div>
    </header>
  );
}
