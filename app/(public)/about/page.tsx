import { AboutSection } from "@/components/public/AboutSection";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl bg-[#FDF6EC] px-6 py-16">
      <AboutSection />
    </main>
  );
}
