import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { env } from "./env.mjs";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/login")) {
    return res;
  }

  const session = await getIronSession(req, res, {
    cookieName: env.IRON_SESSION_COOKIE_NAME,
    password: env.IRON_SESSION_PASSWORD,
  });

  const { user, destroy } = session;

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Destroy user session if is deactivated
  if (user.isDeactivated === true) {
    destroy();

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Disable /login if user has session
  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Disable /admin if user isn't an admin
  if (req.nextUrl.pathname.startsWith("/admin") && user.isAdmin !== true) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
};

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
