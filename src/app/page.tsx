import CreatePDF from "@/app/page.client";
import { getServerSideHelpers } from "@/trpc/server";
import Hydrate from "@/components/providers/Hydrate";

export default async function Page() {
  const helpers = await getServerSideHelpers();
  await helpers.pdf.getTemplates.prefetch();

  return (
    <Hydrate queryClient={helpers.queryClient}>
      <CreatePDF />
    </Hydrate>
  );
}
