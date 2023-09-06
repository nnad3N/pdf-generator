import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const templateRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.template.findMany({
      select: {
        id: true,
        name: true,
        filename: true,
        changedBy: {
          select: {
            email: true,
          },
        },
        updatedAt: true,
        createdAt: true,
        variables: {
          select: {
            id: true,
            label: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { firstName, lastName } = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    const created = await ctx.prisma.template.create({
      data: {
        name: "New Template",
        file: null,
        changedBy: `${firstName} ${lastName}`,
        variables: {
          create: {
            label: "",
            name: "",
          },
        },
      },
    });

    return created;
  }),
  duplicate: protectedProcedure
    .input(
      z.object({
        templateId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, filename, file, variables } =
        await ctx.prisma.template.findUniqueOrThrow({
          where: {
            id: input.templateId,
          },
          select: {
            name: true,
            filename: true,
            file: true,
            variables: {
              select: {
                label: true,
                name: true,
              },
            },
          },
        });

      const { firstName, lastName } = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          firstName: true,
          lastName: true,
        },
      });

      const created = await ctx.prisma.template.create({
        data: {
          name: `${name} - Copy`,
          filename,
          file,
          changedBy: `${firstName} ${lastName}`,
          variables: {
            create: variables,
          },
        },
      });

      return created;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        templateId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const removed = await ctx.prisma.template.delete({
        where: {
          id: input.templateId,
        },
      });

      return removed;
    }),
});
