import { getCachedUser } from "@/server/cache";
import { redirect } from "next/navigation";

export default async function AdminLayout(props: {
  children: React.ReactNode;
}) {
  const user = await getCachedUser();

  if (!user?.isAdmin) redirect("/");

  return <>{props.children}</>;
}
