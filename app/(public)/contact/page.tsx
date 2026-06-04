import { ContactForm } from "@/components/public/ContactForm";
import { ContactOwnerSidebar } from "@/components/public/ContactOwnerSidebar";
import { getHomesForPublicInventory } from "@/lib/db/homes";
import { getPublicTurnstileSiteKey } from "@/lib/turnstile/config";
import type { ContactHomeOption } from "@/lib/types/contact-form";

export const metadata = {
  title: "Contact Us",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const homes = await getHomesForPublicInventory();
  const homeOptions: ContactHomeOption[] = homes.map((home) => ({
    id: home.id,
    title: home.title,
  }));
  const turnstileSiteKey = getPublicTurnstileSiteKey();

  return (
    <main className="min-h-screen bg-[#FDF6EC] py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 text-[#4B3621] md:grid-cols-2">
        <ContactForm
          homeOptions={homeOptions}
          turnstileSiteKey={turnstileSiteKey}
        />
        <ContactOwnerSidebar />
      </div>
    </main>
  );
}
