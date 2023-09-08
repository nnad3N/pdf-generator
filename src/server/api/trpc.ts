import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/server/db";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { env } from "@/env.mjs";
import { auth } from "../auth";
import { type Session } from "lucia";

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    auth,
  };
};

export const createTRPCContext = async (_opts: FetchCreateContextFnOptions) => {
  const sessionId = cookies().get(env.SESSION_COOKIE_NAME)?.value;
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const enforceIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.session.user.isDeactivated) {
    await auth.invalidateAllUserSessions(ctx.session.user.userId);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "This account is deactivated.",
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});
const enforceIsAdmin = enforceIsAuthed.unstable_pipe(async ({ ctx, next }) => {
  if (ctx.session.user.isAdmin !== true) {
    await auth.invalidateAllUserSessions(ctx.session.user.userId);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx,
  });
});

export const protectedProcedure = t.procedure.use(enforceIsAuthed);
export const adminProcedure = t.procedure.use(enforceIsAdmin);
