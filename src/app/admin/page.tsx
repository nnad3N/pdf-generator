import Admin from "@/app/admin/page.client";

import { getServerSideHelpers } from "@/trpc/server";
import Hydrate from "@/components/providers/Hydrate";

export default async function Page() {
  const helpers = await getServerSideHelpers();
  await helpers.user.getAll.prefetch();

  return (
    <Hydrate queryClient={helpers.queryClient}>
      <Admin />
    </Hydrate>
  );
}
