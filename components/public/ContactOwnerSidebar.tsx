import { cardClassName } from "@/lib/ui";

export function ContactOwnerSidebar() {
  return (
    <aside className={`${cardClassName} space-y-5 p-8 font-[family-name:var(--font-open-sans)]`}>
      <h3 className="text-2xl font-bold text-[#5C4033]">Owner Information</h3>
      <dl className="space-y-4 text-[#4B3621]">
        <div>
          <dt className="font-semibold text-[#5C4033]">Owner</dt>
          <dd>Lynn Sitterud</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Phone</dt>
          <dd>
            <a
              href="tel:4357490270"
              className="text-red-700 underline-offset-2 hover:underline"
            >
              435-749-0270
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Message us</dt>
          <dd className="leading-relaxed">
            Use the contact form — we will reply by email or phone.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Location</dt>
          <dd>Huntington, Utah</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#5C4033]">Business Hours</dt>
          <dd className="leading-relaxed">
            Mon–Fri: 9:00 AM – 5:00 PM
            <br />
            Sat: 9:00 AM – 5:00 PM
            <br />
            Sun: Closed
          </dd>
        </div>
      </dl>
    </aside>
  );
}
