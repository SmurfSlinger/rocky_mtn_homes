import { LoginForm } from "@/components/staff/LoginForm";

export const metadata = {
  title: "Staff Login",
};

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDF6EC] px-4 font-sans text-[#5C4033]">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-[#D2B48C] bg-[#FAF4E6] p-8 shadow-lg">
        <h1 className="text-center font-serif text-3xl font-bold">
          Staff Login
        </h1>
        <LoginForm redirectFrom={from} />
        <p className="text-center text-sm text-[#4b3621]">
          <a href="/" className="text-[#8B2C2C] hover:underline">
            &larr; Back to public site
          </a>
        </p>
      </div>
    </main>
  );
}
