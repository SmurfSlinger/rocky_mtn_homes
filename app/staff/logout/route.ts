import { clearStaffSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

/** GET handler for legacy `/staff/logout.php` redirects. */
export async function GET() {
  await clearStaffSession();
  redirect("/staff/login");
}
