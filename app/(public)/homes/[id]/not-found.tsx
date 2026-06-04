import Link from "next/link";

export default function HomeNotFound() {
  return (
    <main className="min-h-screen bg-[#FDF6EC] px-6 py-16 text-center text-[#5C4033]">
      <h1 className="mb-4 text-3xl font-bold">Home not found</h1>
      <p className="mb-8 text-[#4b3621]">
        That listing does not exist or is no longer available.
      </p>
      <Link
        href="/inventory"
        className="rounded bg-[#8B2C2C] px-6 py-2 text-white hover:bg-[#A94438]"
      >
        Back to Inventory
      </Link>
    </main>
  );
}
