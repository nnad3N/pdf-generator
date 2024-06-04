import CreatePDF from "@/app/page.client";
import { getServerSideHelpers } from "@/trpc/server";
import Hydrate from "@/components/providers/Hydrate";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    // Change this if this page isn't in /app/ anymore
    absolute: "Generate | PDF Generator",
  },
};

export default async function Page() {
  const helpers = await getServerSideHelpers();
  await helpers.pdf.getTemplates.prefetch();

  return (
    <Hydrate queryClient={helpers.queryClient}>
      <CreatePDF />
    </Hydrate>
  );
}
