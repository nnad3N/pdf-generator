"use server";

import { env } from "@/env.mjs";
import { auth } from "@/server/auth";
import { type LoginSchema, loginSchema } from "@/utils/schemas";
import { type TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { LuciaError } from "lucia";
import { cookies } from "next/headers";

type LoginActionReturn = {
  code: TRPC_ERROR_CODE_KEY | "SUCCESS";
  message?: string;
};

export const loginAction = async (
  data: LoginSchema,
): Promise<LoginActionReturn> => {
  try {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      return {
        code: "BAD_REQUEST",
      };
    }

    const { email, password } = result.data;

    const key = await auth.useKey("email", email, password);
    const user = await auth.getUser(key.userId);

    if (user.isDeactivated) {
      return {
        code: "FORBIDDEN",
        message: "This account is deactivated.",
      };
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: undefined,
    });

    const { name, value, attributes } = auth.createSessionCookie(session);
    cookies().set(name, value, attributes);

    return {
      code: "SUCCESS",
    };
  } catch (e) {
    if (e instanceof LuciaError && e.message === "AUTH_INVALID_KEY_ID") {
      return {
        code: "NOT_FOUND",
        message: "This account does not exist.",
      };
    }
    if (e instanceof LuciaError && e.message === "AUTH_INVALID_PASSWORD") {
      return {
        code: "UNAUTHORIZED",
        message: "Bad password.",
      };
    }

    return {
      code: "INTERNAL_SERVER_ERROR",
    };
  }
};

export const logoutAction = async () => {
  const sessionId = cookies().get(env.SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await auth.invalidateSession(sessionId);
    cookies().delete(env.SESSION_COOKIE_NAME);
  }
};
