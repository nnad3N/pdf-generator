import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/server/db";
import { auth } from "@/server/auth";
import { cookies as nextCookies } from "next/headers";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    prisma,
    ...opts,
  };
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

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const cookies = nextCookies();
  const sessionId = cookies.get(auth.sessionCookieName)?.value;

  const { session, user } = await auth.validateSession(sessionId ?? "");

  if (!session || user.isDeactivated) {
    const sessionCookie = auth.createBlankSessionCookie();
    cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (session.fresh) {
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

const isAdmin = isAuthed.unstable_pipe(async ({ next, ctx }) => {
  if (ctx.user.isAdmin === false) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx,
  });
});

export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
