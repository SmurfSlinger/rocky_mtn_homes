import Link from "next/link";
import { buttonPrimaryClassName } from "@/lib/ui";

export function HomeCtaSection() {
  return (
    <section className="bg-[#EEE4D0] py-20 text-[#5C4033]">
      <div className="mx-auto max-w-4xl space-y-8 px-6">
        <h2 className="text-center font-serif text-4xl">Why Choose Us?</h2>
        <p className="text-center text-lg font-light leading-relaxed">
          At Rocky Mountain Home Sales, we&apos;re not just selling homes —
          we&apos;re helping families plant roots. We specialize in homes that
          combine value, beauty, and lasting quality. Whether you&apos;re starting
          out or settling down, we&apos;ll help you find the perfect fit.
        </p>
        <div className="text-center">
          <Link href="/contact" className={`${buttonPrimaryClassName} px-6 py-3`}>
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
