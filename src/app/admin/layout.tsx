import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout(props: {
  children: React.ReactNode;
}) {
  const session = await getPageSession();

  if (!session?.user.isAdmin) redirect("/");

  return <>{props.children}</>;
}
