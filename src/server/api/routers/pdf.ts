import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { pdfSchema } from "@/utils/schemas";
import puppeteer from "puppeteer";

export const pdfRouter = createTRPCRouter({
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
            name: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(pdfSchema)
    .mutation(async ({ ctx, input }) => {
      const { file } = await ctx.prisma.template.findUniqueOrThrow({
        where: {
          id: input.templateId,
        },
        select: {
          file: true,
        },
      });

      const browser = await puppeteer.launch({
        headless: "new",
      });
      const page = await browser.newPage();

      let html = Buffer.from(file).toString("utf-8");
      input.variables.forEach(
        ({ name, value }) => (html = html.replace(name, value)),
      );

      await page.setContent(html, { waitUntil: "domcontentloaded" });
      await page.emulateMediaType("screen");

      const pdf = await page.pdf({
        margin: { top: "75px", right: "50px", bottom: "75px", left: "50px" },
        printBackground: true,
        format: "A4",
      });

      await browser.close();

      return {
        filename: input.filename,
        file: Buffer.from(pdf).toString("base64"),
      };
    }),
});
