import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { hash } from "bcrypt";
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
  upsert: adminProcedure
    .input(
      z
        .object({
          userId: z.string().uuid().optional(),
        })
        .merge(userSchema),
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hash(input.password, 12);
      const { userId, ...user } = input;

      return ctx.prisma.user.upsert({
        where: {
          id: userId,
        },
        create: {
          ...user,
          password: hashedPassword,
        },
        update: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          isAdmin: input.isAdmin,
        },
      });
    }),
  toggleActive: adminProcedure
    .input(z.object({ userId: z.string().uuid(), isDeactivated: z.boolean() }))
    .mutation(({ input, ctx }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          message:
            "You can't activate/deactivate the same account as the one you are currently using.",
          code: "BAD_REQUEST",
        });
      }

      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isDeactivated: input.isDeactivated,
        },
      });
    }),
  updatePassword: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hash(input.password, 12);
      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          password: hashedPassword,
        },
      });
    }),
  delete: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(({ input, ctx }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          message:
            "You can't delete the same account as the one you are currently using.",
          code: "BAD_REQUEST",
        });
      }

      return ctx.prisma.user.delete({
        where: {
          id: input.userId,
        },
      });
    }),
});
