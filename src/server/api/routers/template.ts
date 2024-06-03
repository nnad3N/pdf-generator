import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { type TemplateSchema, templateSchema } from "@/lib/schemas";

type VariableToUpdate = Required<TemplateSchema["variables"][number]>;

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
    .input(templateSchema)
    .mutation(async ({ ctx, input }) => {
      const maybeTemplate = input.templateId
        ? await ctx.prisma.template.findUnique({
            where: {
              id: input.templateId,
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
        : undefined;

      if (!maybeTemplate && input.file) {
        const file = Buffer.from(input.file, "base64");

        await ctx.prisma.template.create({
          data: {
            name: input.name,
            filename: input.filename,
            file,
            userId: ctx.user.id,
            variables: {
              create: input.variables,
            },
          },
        });
        return;
      }

      if (maybeTemplate) {
        const filename = input.file ? input.filename : undefined;
        const file = input.file ? Buffer.from(input.file, "base64") : undefined;

        const variablesToUpdate: VariableToUpdate[] = [];

        const variablesToCreate = input.variables.filter((variable) => {
          if (typeof variable.id === "undefined") {
            return true;
          } else if (typeof variable.id === "string") {
            variablesToUpdate.push(variable as VariableToUpdate);
          }
          return false;
        });

        const variablesToDelete = maybeTemplate.variables.filter(
          ({ id }) => !variablesToUpdate.some((variable) => variable.id === id),
        );

        await ctx.prisma.$transaction([
          ctx.prisma.template.update({
            where: {
              id: input.templateId,
            },
            data: {
              name: input.name,
              filename,
              file,
              userId: ctx.user.id,
              variables: {
                create: variablesToCreate,
                deleteMany: variablesToDelete,
              },
            },
          }),
          ...variablesToUpdate.map(({ id, ...data }) =>
            ctx.prisma.variable.update({
              where: {
                id,
              },
              data,
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
          userId: ctx.user.id,
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
