import CreatePDF from "@/app/page.client";
import { appRouter } from "@/server/api/root";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { headers } from "next/headers";
import SuperJSON from "superjson";

export default async function Page() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      auth,
      headers: headers(),
    },
    transformer: SuperJSON,
  });

  await helpers.pdf.getTemplates.fetch();
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatePDF />
    </HydrationBoundary>
  );
}
