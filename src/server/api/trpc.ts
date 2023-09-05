import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/server/db";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { type IronSessionData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { env } from "@/env.mjs";

type CreateContextOptions = {
  session: IronSessionData;
  resHeaders: Headers;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    resHeaders: opts.resHeaders,
  };
};

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await unsealData(cookies().get("iron-session")?.value ?? "", {
    password: env.IRON_SESSION_PASSWORD,
  });

  return createInnerTRPCContext({
    session,
    resHeaders: opts.resHeaders,
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
  if (!ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    select: {
      isDeactivated: true,
      isAdmin: true,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  if (user.isDeactivated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "This account is deactivated.",
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        user: ctx.session.user,
      },
      user,
    },
  });
});
const enforceIsAdmin = enforceIsAuthed.unstable_pipe(async ({ ctx, next }) => {
  if (ctx.user.isAdmin !== true) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        user: ctx.session.user,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceIsAuthed);
export const adminProcedure = t.procedure.use(enforceIsAdmin);
