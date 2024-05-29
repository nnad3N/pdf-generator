import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { userSchema } from "@/lib/schemas";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
        isDeactivated: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  upsert: adminProcedure.input(userSchema).mutation(async ({ input, ctx }) => {
    const { userId, password, ...attributes } = input;

    if (userId) {
      if (userId === ctx.user.id && !attributes.isAdmin) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot make your own account a user.",
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: attributes,
      });
    } else {
      if (!password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need to set the password.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await ctx.prisma.user.create({
        data: {
          ...attributes,
          password: hashedPassword,
        },
      });
    }
  }),
  toggleActive: adminProcedure
    .input(z.object({ userId: z.string(), isDeactivated: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          message: `You cannot ${
            input.isDeactivated ? "deactivate" : "activate"
          } your own account.`,
          code: "BAD_REQUEST",
        });
      }
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isDeactivated: input.isDeactivated,
        },
      });

      if (input.isDeactivated) {
        await ctx.auth.invalidateUserSessions(input.userId);
      }
    }),
  updatePassword: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      if (input.userId !== ctx.user.id) {
        await ctx.auth.invalidateUserSessions(input.userId);
      }
    }),
  delete: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          message: "You cannot delete your own account.",
          code: "BAD_REQUEST",
        });
      }
      await ctx.prisma.user.delete({
        where: {
          id: input.userId,
        },
      });
    }),
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          id: true,
          password: true,
          isDeactivated: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (user.isDeactivated) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const isValid = await bcrypt.compare(input.password, user.password);

      if (!isValid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [session] = await Promise.all([
        ctx.auth.createSession(user.id, {}),
        ctx.auth.deleteExpiredSessions(),
      ]);
      const sessionCookie = ctx.auth.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),
  signOut: protectedProcedure.mutation(({ ctx }) => {
    const sessionCookie = ctx.auth.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }),
});
