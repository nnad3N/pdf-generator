import { unexpectedErrorString } from "@/components/LoginForm";
import { auth } from "@/server/auth";
import { loginSchema } from "@/utils/schemas";
import { LuciaError } from "lucia";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as unknown;

  try {
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { email, password } = result.data;

    const key = await auth.useKey("email", email, password);
    const user = await auth.getUser(key.userId);

    if (user.isDeactivated) {
      return NextResponse.json(
        { error: "This account is deactivated" },
        { status: 403 },
      );
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest({
      request,
      cookies,
    });
    authRequest.setSession(session);
    return new Response(null, { status: 200 });
  } catch (e) {
    if (e instanceof LuciaError && e.message === "AUTH_INVALID_KEY_ID") {
      return NextResponse.json(
        { error: "This account does not exist" },
        { status: 404 },
      );
    }
    if (e instanceof LuciaError && e.message === "AUTH_INVALID_PASSWORD") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ error: unexpectedErrorString }, { status: 500 });
  }
};
