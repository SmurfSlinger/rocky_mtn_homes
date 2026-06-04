import { siteAssets } from "@/lib/site-assets";
import Image from "next/image";

export function AboutSection() {
  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
      <div className="md:w-1/2">
        <div className="overflow-hidden rounded-xl shadow-lg">
          <Image
            src={siteAssets.aboutMountains}
            alt="Rocky Mountains"
            width={800}
            height={560}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </div>

      <div className="space-y-4 md:w-1/2">
        <h1 className="text-4xl font-bold text-[#5C4033]">About Us</h1>
        <p className="text-lg leading-relaxed text-[#4b3621]">
          <strong>Rocky Mountain Home Sales</strong> was founded by{" "}
          <strong>Lynn Sitterud</strong>, a proud lifelong resident of{" "}
          <em>Huntington, Utah</em>. With decades of experience as the former owner
          of <em>Mac&apos;s Mining Repair</em>, current owner and manager of{" "}
          <em>Wally&apos;s Tire &amp; Wheel</em>, and a respected former{" "}
          <strong>Emery County Commissioner</strong>, Lynn brings deep community
          ties and business expertise to the table.
        </p>
        <p className="text-lg leading-relaxed text-[#4b3621]">
          His passion for helping families find affordable, quality housing
          solutions across Utah is what drives our mission. At Rocky Mountain Home
          Sales, we pair local values with expert service to bring your dream home
          within reach.
        </p>
      </div>
    </div>
  );
}
