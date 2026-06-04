import { getStaffSessionFromRequest } from "@/lib/auth/session-token";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/staff/login";
const DEFAULT_STAFF_HOME = "/staff/homes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/staff")) {
    return NextResponse.next();
  }

  const isLoginPage =
    pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);

  const session = await getStaffSessionFromRequest(request);

  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL(DEFAULT_STAFF_HOME, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*"],
};
