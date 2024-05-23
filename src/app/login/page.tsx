import LoginForm from "./page.client";
import { getCachedUser } from "@/server/cache";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCachedUser();

  if (user) {
    redirect("/");
  }

  return <LoginForm />;
}
