"use server";

import { env } from "@/env.mjs";
import { saveServerActionSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { type LoginSchema, loginSchema } from "@/utils/schemas";
import { type TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginActionReturn = {
  code: TRPC_ERROR_CODE_KEY;
  message: string | null;
};

export const loginAction = async (
  data: LoginSchema,
): Promise<LoginActionReturn> => {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      code: "BAD_REQUEST",
      message: null,
    };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      isAdmin: true,
      isDeactivated: true,
    },
  });

  if (!user) {
    return {
      code: "NOT_FOUND",
      message: "This account does not exist.",
    };
  }

  if (user.isDeactivated) {
    return {
      code: "FORBIDDEN",
      message: "This account is deactivated.",
    };
  }

  const valid = await compare(password, user.password);

  if (!valid) {
    return {
      code: "UNAUTHORIZED",
      message: "Bad password.",
    };
  }

  await saveServerActionSession({
    user: {
      id: user.id,
      isAdmin: user.isAdmin,
      isDeactivated: user.isDeactivated,
    },
  });

  redirect("/");
};

export const logoutAction = () => {
  cookies().delete(env.IRON_SESSION_COOKIE_NAME);
  redirect("/login");
};
