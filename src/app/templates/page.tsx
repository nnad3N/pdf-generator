import Template from "@/app/templates/page.client";
import { getServerSideHelpers } from "@/trpc/server";
import Hydrate from "@/components/providers/Hydrate";

export default async function Page() {
  const helpers = await getServerSideHelpers();
  await helpers.template.getAll.prefetch();

  return (
    <Hydrate queryClient={helpers.queryClient}>
      <Template />
    </Hydrate>
  );
}
