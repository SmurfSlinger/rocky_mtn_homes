import { siteAssets } from "@/lib/site-assets";
import Image from "next/image";
import Link from "next/link";
import { buttonPrimaryClassName } from "@/lib/ui";

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:items-start">
      <div className="space-y-6 rounded-xl border border-[#D2B48C]/40 bg-[#5C4033]/55 p-10 shadow-xl backdrop-blur-sm md:w-1/2">
        <h1 className="font-serif text-3xl font-bold leading-tight text-[#FDF6EC] drop-shadow md:text-5xl">
          Built for Utah. Priced for Families.
        </h1>
        <p className="text-lg font-light leading-relaxed text-[#FDF6EC]">
          Find your dream home, manufactured for affordability and reliability.
        </p>
        <Link href="/inventory" className={buttonPrimaryClassName}>
          View Available Homes
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#D2B48C]/40 shadow-xl md:w-1/2">
        <div className="relative h-96 w-full md:min-h-[28rem] md:h-auto md:aspect-[4/3]">
          <Image
            src={siteAssets.heroHome}
            alt="Manufactured Home Example"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
