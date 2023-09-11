import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { templateRouter } from "@/server/api/routers/template";
import { pdfRouter } from "@/server/api/routers/pdf";

export const appRouter = createTRPCRouter({
  user: userRouter,
  template: templateRouter,
  pdf: pdfRouter,
});

export type AppRouter = typeof appRouter;
