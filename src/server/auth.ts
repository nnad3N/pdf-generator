import { env } from "@/env.mjs";
import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { prisma as client } from "@/server/db";
import "lucia/polyfill/node";
import { cache } from "react";
import { cookies } from "next/headers";

export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs(),
  sessionCookie: {
    name: env.SESSION_COOKIE_NAME,
    expires: false,
  },
  getUserAttributes: ({ isAdmin, isDeactivated }) => ({
    isAdmin,
    isDeactivated,
  }),
  adapter: prisma(client),
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  });
  return authRequest.validate();
});
