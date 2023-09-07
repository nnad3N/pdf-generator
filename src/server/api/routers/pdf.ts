import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const pdfRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.pdf.findMany({
      select: {
        id: true,
        filename: true,
        createdBy: {
          select: {
            email: true,
          },
        },
        createdAt: true,
      },
    });
  }),
  getTemplates: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.template.findMany({
      select: {
        id: true,
        name: true,
        variables: {
          select: {
            id: true,
            label: true,
            type: true,
            value: true,
          },
        },
      },
    });
  }),
  download: protectedProcedure
    .input(
      z.object({
        pdfId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { file } = await ctx.prisma.pdf.findUniqueOrThrow({
        where: {
          id: input.pdfId,
        },
        select: {
          file: true,
        },
      });

      return {
        file: Buffer.from(file).toString("base64"),
      };
    }),
  delete: protectedProcedure
    .input(
      z.object({
        pdfId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.pdf.delete({
        where: {
          id: input.pdfId,
        },
      });
    }),
});
