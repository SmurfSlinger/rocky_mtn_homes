import Image from "next/image";
import Link from "next/link";
import type { HomeSummary } from "@/lib/types/database";

type HomeCardProps = {
  home: HomeSummary;
};

export function HomeCard({ home }: HomeCardProps) {
  const isAvailable = home.status.toLowerCase() === "available";
  const statusLabel = isAvailable ? "Available" : home.status || "Listed";

  return (
    <article className="overflow-hidden rounded-xl border border-[#D2B48C] bg-[#FAF4E6] shadow-md transition hover:shadow-xl">
      <Link href={`/homes/${home.id}`} className="group block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={home.imagePath}
            alt={home.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span
            className={`absolute right-3 top-3 rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
              isAvailable
                ? "bg-[#8B2C2C] text-white"
                : "bg-[#5C4033]/80 text-[#FDF6EC]"
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="p-4 text-[#5C4033]">
          <h2 className="mb-1 text-xl font-semibold group-hover:text-[#8B2C2C]">
            {home.title}
          </h2>
          {home.price ? (
            <p className="mb-2 text-sm font-medium text-[#8B2C2C]">{home.price}</p>
          ) : null}
          <p className="mb-2 line-clamp-2 text-sm text-[#4b3621]">
            {home.description}
          </p>
          <p className="mb-1 font-medium">{home.squareFootage} sq ft</p>
          <p className="text-sm text-[#4b3621]">
            {home.lengthFt} x {home.widthFt} ft
          </p>
        </div>
      </Link>
    </article>
  );
}
