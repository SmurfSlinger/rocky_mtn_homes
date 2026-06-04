import { FeaturesGrid } from "@/components/public/FeaturesGrid";
import { HeroSection } from "@/components/public/HeroSection";
import { HomeCtaSection } from "@/components/public/HomeCtaSection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FDF6EC] font-sans text-[#5C4033]">
      <HeroSection />
      <FeaturesGrid />
      <HomeCtaSection />
    </main>
  );
}
