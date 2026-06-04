const features = [
  {
    title: "Modern Layouts",
    description:
      "Open floor plans, high ceilings, and large windows for a spacious feel.",
  },
  {
    title: "Utah-Ready Builds",
    description:
      "Engineered for durability in high desert and mountain conditions.",
  },
  {
    title: "Affordable Ownership",
    description:
      "Own your home without breaking the bank — our manufactured homes are significantly more affordable than traditionally built homes.",
  },
  {
    title: "Move-Ready Flexibility",
    description:
      "Manufactured for mobility — our homes are built to move with you. Whether you're relocating across town or across the state, you're ready for the journey.",
  },
] as const;

export function FeaturesGrid() {
  return (
    <section className="bg-[#F7EEDD] py-24 text-[#5C4033]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-6 shadow-lg transition hover:shadow-2xl"
          >
            <h3 className="mb-3 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
