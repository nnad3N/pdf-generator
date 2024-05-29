import Admin from "@/app/admin/page.client";

import { getServerSideHelpers } from "@/trpc/server";
import Hydrate from "@/components/providers/Hydrate";
import { getCachedUser } from "@/server/cache";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCachedUser();

  if (!user?.isAdmin) return redirect("/");

  const helpers = await getServerSideHelpers();
  await helpers.user.getAll.prefetch();

  return (
    <Hydrate queryClient={helpers.queryClient}>
      <Admin />
    </Hydrate>
  );
}
