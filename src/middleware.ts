import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestOrigin } from "lucia";

export function middleware(req: NextRequest) {
  // https://lucia-auth.com/guides/validate-session-cookies/
  if (req.method !== "GET") {
    const origin = req.nextUrl.origin;
    const host = req.nextUrl.host;

    if (!origin || !host || !verifyRequestOrigin(origin, [host])) {
      return new NextResponse(null, {
        status: 403,
      });
    }
  }

  return NextResponse.next();
}

// Clerk matcher
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
