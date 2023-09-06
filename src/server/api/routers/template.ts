import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { type TemplateSchema, templateSchema } from "@/utils/schemas";

type WithoutUndefined<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

type VariablesToUpdate = WithoutUndefined<
  TemplateSchema["variables"][number]
>[];

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
  upsert: protectedProcedure
    .input(
      templateSchema.extend({
        id: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const template = input.id
        ? await ctx.prisma.template.findUnique({
            where: {
              id: input.id,
            },
            select: {
              id: true,
              variables: {
                select: {
                  id: true,
                },
              },
            },
          })
        : null;

      if (!template && input.file) {
        const file = Buffer.from(input.file, "base64");

        await ctx.prisma.template.create({
          data: {
            name: input.name,
            filename: input.filename,
            file,
            userId: ctx.session.user.id,
            variables: {
              create: input.variables,
            },
          },
        });
        return;
      }

      if (template) {
        const filename = input.file ? input.filename : undefined;
        const file = input.file ? Buffer.from(input.file, "base64") : undefined;

        const variablesToUpdate: VariablesToUpdate = [];

        const variablesToCreate = input.variables.filter((variable) => {
          if (typeof variable.id === "undefined") {
            return true;
          } else if (typeof variable.id === "string") {
            variablesToUpdate.push(variable as VariablesToUpdate[number]);
          }
          return false;
        });

        const variablesToDelete = template.variables.filter(
          ({ id }) => !variablesToUpdate.some((variable) => variable.id === id),
        );

        await ctx.prisma.$transaction([
          ctx.prisma.template.update({
            where: {
              id: input.id,
            },
            data: {
              name: input.name,
              filename,
              file,
              userId: ctx.session.user.id,
              variables: {
                create: variablesToCreate,
                deleteMany: variablesToDelete,
              },
            },
          }),
          ...variablesToUpdate.map(({ id, ...rest }) =>
            ctx.prisma.variable.update({
              where: {
                id,
              },
              data: rest,
            }),
          ),
        ]);
      }
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
                type: true,
              },
            },
          },
        });

      await ctx.prisma.template.create({
        data: {
          name: `${name} - Copy`,
          filename,
          file,
          userId: ctx.session.user.id,
          variables: {
            create: variables,
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        templateId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.template.delete({
        where: {
          id: input.templateId,
        },
      });
    }),
});
