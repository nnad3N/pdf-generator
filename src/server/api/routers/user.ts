import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { userSchema } from "@/utils/schemas";
import { TRPCError } from "@trpc/server";

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
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  upsert: adminProcedure.input(userSchema).mutation(async ({ input, ctx }) => {
    const { userId, password, ...attributes } = input;

    if (userId) {
      await ctx.auth.updateUserAttributes(userId, attributes);
      await ctx.auth.invalidateAllUserSessions(userId);
    } else {
      if (!password) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await ctx.auth.createUser({
        key: {
          providerId: "email",
          providerUserId: attributes.email,
          password,
        },
        attributes,
      });
    }
  }),
  toggleActive: adminProcedure
    .input(z.object({ userId: z.string(), isDeactivated: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.userId) {
        throw new TRPCError({
          message:
            "You can't activate/deactivate the same account as the one you are currently using.",
          code: "BAD_REQUEST",
        });
      }
      await ctx.auth.updateUserAttributes(input.userId, {
        isDeactivated: input.isDeactivated,
      });
      await ctx.auth.invalidateAllUserSessions(input.userId);
    }),
  updatePassword: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await ctx.auth.updateKeyPassword(
        "email",
        input.email,
        input.password,
      );
      await ctx.auth.invalidateAllUserSessions(key.userId);
    }),
  delete: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.userId) {
        throw new TRPCError({
          message:
            "You can't delete the same account as the one you are currently using.",
          code: "BAD_REQUEST",
        });
      }
      await ctx.auth.deleteUser(input.userId);
    }),
});
