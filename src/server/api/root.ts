import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { templateRouter } from "./routers/template";
import { pdfRouter } from "./routers/pdf";

export const appRouter = createTRPCRouter({
  user: userRouter,
  template: templateRouter,
  pdf: pdfRouter,
});

export type AppRouter = typeof appRouter;
